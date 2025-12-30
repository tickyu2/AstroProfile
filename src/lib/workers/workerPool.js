/**
 * Worker Pool for Parallel Processing
 * Optional - use for high-volume scenarios (>100 messages/second)
 */

let Worker, fileURLToPath, dirname, join;

// Dynamic imports for Node.js environment
const initNodeModules = async () => {
  try {
    const workerThreads = await import('worker_threads');
    Worker = workerThreads.Worker;
    const url = await import('url');
    fileURLToPath = url.fileURLToPath;
    const path = await import('path');
    dirname = path.dirname;
    join = path.join;
    return true;
  } catch (e) {
    return false;
  }
};

export class WorkerPool {
  constructor(options = {}) {
    this.poolSize = options.poolSize || 4;
    this.workers = [];
    this.queue = [];
    this.nextWorkerId = 0;
    this.isInitialized = false;
    this.isNodeEnvironment = false;
  }

  /**
   * Initialize worker pool
   */
  async init() {
    if (this.isInitialized) return;

    // Check if we're in Node.js environment
    this.isNodeEnvironment = await initNodeModules();

    if (!this.isNodeEnvironment) {
      console.warn('[WorkerPool] Worker threads not available in this environment');
      return;
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const workerPath = join(__dirname, 'analysisWorker.js');

    for (let i = 0; i < this.poolSize; i++) {
      try {
        const worker = new Worker(workerPath);

        worker.on('message', (result) => {
          this.handleResult(result);
        });

        worker.on('error', (error) => {
          console.error(`[WorkerPool] Worker ${i} error:`, error);
        });

        worker.on('exit', (code) => {
          if (code !== 0) {
            console.error(`[WorkerPool] Worker ${i} exited with code ${code}`);
          }
        });

        this.workers.push({
          worker,
          busy: false,
          id: i,
          currentTask: null
        });
      } catch (error) {
        console.error(`[WorkerPool] Failed to create worker ${i}:`, error);
      }
    }

    this.isInitialized = this.workers.length > 0;
    console.log(`[WorkerPool] Initialized with ${this.workers.length} workers`);
  }

  /**
   * Analyze text using worker threads
   */
  async analyze(text, voiceEmotion) {
    if (!this.isInitialized) {
      throw new Error('WorkerPool not initialized. Call init() first.');
    }

    return new Promise((resolve, reject) => {
      const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Add to queue
      this.queue.push({
        id: taskId,
        text,
        voiceEmotion,
        resolve,
        reject,
        timestamp: Date.now()
      });

      // Try to process immediately
      this.processQueue();

      // Timeout after 5 seconds
      setTimeout(() => {
        const index = this.queue.findIndex(t => t.id === taskId);
        if (index !== -1) {
          this.queue.splice(index, 1);
          reject(new Error('Analysis timeout'));
        }
      }, 5000);
    });
  }

  /**
   * Process queued tasks
   */
  processQueue() {
    // Find available worker
    const availableWorker = this.workers.find(w => !w.busy);

    if (!availableWorker || this.queue.length === 0) {
      return;
    }

    // Get next task
    const task = this.queue.shift();

    // Mark worker as busy
    availableWorker.busy = true;
    availableWorker.currentTask = task;

    // Send to worker
    availableWorker.worker.postMessage({
      id: task.id,
      text: task.text,
      voiceEmotion: task.voiceEmotion
    });
  }

  /**
   * Handle result from worker
   */
  handleResult(result) {
    // Find worker that sent this result
    const workerInfo = this.workers.find(w =>
      w.currentTask && w.currentTask.id === result.id
    );

    if (!workerInfo) return;

    const task = workerInfo.currentTask;

    // Mark worker as available
    workerInfo.busy = false;
    workerInfo.currentTask = null;

    // Resolve promise
    if (result.success) {
      task.resolve(result.result);
    } else {
      task.reject(new Error(result.error));
    }

    // Process next task in queue
    this.processQueue();
  }

  /**
   * Terminate all workers
   */
  async terminate() {
    for (const workerInfo of this.workers) {
      await workerInfo.worker.terminate();
    }
    this.workers = [];
    this.isInitialized = false;
  }

  /**
   * Get worker pool statistics
   */
  getStats() {
    return {
      poolSize: this.poolSize,
      activeWorkers: this.workers.filter(w => w.busy).length,
      idleWorkers: this.workers.filter(w => !w.busy).length,
      queueLength: this.queue.length,
      isInitialized: this.isInitialized
    };
  }
}

// Singleton instance (optional, can create multiple pools)
export const workerPool = new WorkerPool({ poolSize: 4 });
