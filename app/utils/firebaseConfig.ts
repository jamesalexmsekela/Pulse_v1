// app/utils/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBASdbuMb01sEoDbcQfB6QjePqEl5EHtLo",
  authDomain: "pulse-v1-4fb34.firebaseapp.com",
  projectId: "pulse-v1-4fb34",
  storageBucket: "pulse-v1-4fb34.firebasestorage.app",
  messagingSenderId: "349089045712",
  appId: "1:349089045712:web:b23f24366cd1b7fd0e12d5",
  measurementId: "G-R9M10YKTRW"
};

// Initialize Firebase if not already initialized
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
  
export { app, db, auth, analytics };