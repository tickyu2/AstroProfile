import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics"; // optional

const firebaseConfig = {
  apiKey: "AIzaSyA3IWknkhYQrsbZN3ZeIt1UVlQhGwGk5sw",
  authDomain: "astroprofile-391e6.firebaseapp.com",
  databaseURL: "https://astroprofile-391e6-default-rtdb.firebaseio.com",
  projectId: "astroprofile-391e6",
  storageBucket: "astroprofile-391e6.appspot.com", // ✅ fixed
  messagingSenderId: "65260546710",
  appId: "1:65260546710:web:58b344cdce45889e87f0b7",
  measurementId: "G-15JMT26CKR"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// export const analytics = getAnalytics(app); // optional

export default app;
