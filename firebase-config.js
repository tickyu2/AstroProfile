/**
 * Firebase Configuration for AstroProfile
 * Cloud database - no localStorage needed!
 */

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3IWknkhYQrsbZN3ZeIt1UVlQhGwGk5sw",
  authDomain: "astroprofile-391e6.firebaseapp.com",
  projectId: "astroprofile-391e6",
  storageBucket: "astroprofile-391e6.firebasestorage.app",
  messagingSenderId: "65260546710",
  appId: "1:65260546710:web:58b344cdce45889e87f0b7",
  measurementId: "G-15JMT26CKR",
  // ADD THIS AFTER YOU ENABLE REALTIME DATABASE:
  databaseURL: "https://astroprofile-391e6-default-rtdb.firebaseio.com"
};

// Initialize Firebase
let app, database, auth;

function initializeFirebase() {
  try {
    // Check if Firebase SDK is loaded
    if (typeof firebase === 'undefined') {
      console.error('❌ Firebase SDK not loaded. Check script tags in HTML.');
      return false;
    }
    
    // Initialize Firebase app
    app = firebase.initializeApp(firebaseConfig);
    
    // Initialize Realtime Database
    database = firebase.database();
    
    // Initialize Authentication (for future use)
    auth = firebase.auth();
    
    console.log('✅ Firebase initialized successfully');
    console.log('📊 Database URL:', firebaseConfig.databaseURL);
    
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    return false;
  }
}

// Auto-initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  const initialized = initializeFirebase();
  
  if (initialized) {
    console.log('🔥 Firebase ready for AstroProfile!');
  } else {
    console.warn('⚠️ Running in offline mode. Database features disabled.');
  }
});

// Helper: Get database reference
function getDatabase() {
  if (!database) {
    console.error('❌ Database not initialized');
    return null;
  }
  return database;
}

// Helper: Get current user (for future authentication)
function getCurrentUser() {
  if (!auth) {
    return null;
  }
  return auth.currentUser;
}

// Export for use in other modules
window.FirebaseDB = {
  getDatabase,
  getCurrentUser,
  isInitialized: () => !!database
};

console.log('✅ Firebase config loaded');
