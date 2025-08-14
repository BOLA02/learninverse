import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB7zHANsMli6JU67eqX_zk6Lu8Na_ovnjs",
  authDomain: "learninverse-7582b.firebaseapp.com",
  projectId: "learninverse-7582b",
  storageBucket: "learninverse-7582b.firebasestorage.app",
  messagingSenderId: "232008057220",
  appId: "1:232008057220:web:60411821a30d0db7069dd1",
  measurementId: "G-F83VCTLBXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
