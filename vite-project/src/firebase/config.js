// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4bwSL1ym26V5xoxYGUDVtSQG7dMLPGYc",
  authDomain: "rebecca-exim.firebaseapp.com",
  projectId: "rebecca-exim",
  storageBucket: "rebecca-exim.firebasestorage.app",
  messagingSenderId: "685038285809",
  appId: "1:685038285809:web:9b1f27ffaf3457b8268a50",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
