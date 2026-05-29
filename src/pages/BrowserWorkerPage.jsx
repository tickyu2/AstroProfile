import React, { useState } from 'react';

const BROWSER_WORKER_URL = 'http://127.0.0.1:50839';

export default function BrowserWorkerPage() {
  const [goal, setGoal] = useState('https://example.com');
  const [taskId, setTaskId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runTask = async () => {
    if (!goal.trim()) {
      setError('Please enter a URL or goal');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`${BROWSER_WORKER_URL}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: taskId || undefined,
          goal: goal,
          returnMode: 'both'
        })
      });
      const json = await res.json();
      setResult(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🌐 Browser Worker
          </h1>
          <p className="text-slate-300">
            Delegate browser automation tasks to the agent-browser worker.
          </p>
          <div className="text-sm text-slate-400">
            Worker: <code>{BROWSER_WORKER_URL}</code>
          </div>
        </header>

        {/* Input Form */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Task ID (optional)</label>
            <input
              type="text"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              placeholder="auto-generated if empty"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">URL or Goal</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>
          <button
            onClick={runTask}
            disabled={loading}
            className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Running...' : '▶️ Run Task'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 text-red-200">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Result</h2>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                result.status === 'success' 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {result.status}
              </span>
            </div>

            {result.summary && (
              <div className="space-y-1">
                <div className="text-sm text-slate-400">Summary</div>
                <div className="text-slate-100">{result.summary}</div>
              </div>
            )}

            {result.artifacts && (
              <div className="space-y-1">
                <div className="text-sm text-slate-400">Artifacts</div>
                <pre className="text-xs bg-slate-800 p-3 rounded overflow-auto">
                  {JSON.stringify(result.artifacts, null, 2)}
                </pre>
              </div>
            )}

            {result.metadata && (
              <div className="space-y-1">
                <div className="text-sm text-slate-400">Metadata</div>
                <pre className="text-xs bg-slate-800 p-3 rounded overflow-auto">
                  {JSON.stringify(result.metadata, null, 2)}
                </pre>
              </div>
            )}

            {result.error && (
              <div className="space-y-1">
                <div className="text-sm text-red-400">Error</div>
                <pre className="text-xs bg-red-900/30 p-3 rounded overflow-auto">
                  {JSON.stringify(result.error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Quick Examples */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Quick Examples</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'https://example.com',
              'https://wikipedia.org',
              'https://github.com',
              'https://astroprofile.com'
            ].map((url) => (
              <button
                key={url}
                onClick={() => setGoal(url)}
                className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
              >
                {url.replace('https://', '')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
