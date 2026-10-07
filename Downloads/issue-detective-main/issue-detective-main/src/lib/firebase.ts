import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDi4eh2gDUjRYKGCI1XfY3C7Fn-j11Xo6Y",
  authDomain: "civicconnect-c9036.firebaseapp.com",
  projectId: "civicconnect-c9036",
  storageBucket: "civicconnect-c9036.firebasestorage.app",
  messagingSenderId: "709724151876",
  appId: "1:709724151876:web:c35d9276e2bbd268bc1c11",
  measurementId: "G-EM9LL6PTB1"
};

// Initialize Firebase App (prevent re-initialization)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics asynchronously if supported in the current environment
export const analyticsPromise = typeof window !== "undefined"
  ? isSupported().then((supported) => (supported ? getAnalytics(app) : null))
  : Promise.resolve(null);
