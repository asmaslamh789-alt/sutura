// firebase.js - Shared Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCRjVpoBOpr8J_MPr0HHSgvQpIwd48EBk",
  authDomain: "resturant-5b1c2.firebaseapp.com",
  projectId: "resturant-5b1c2",
  storageBucket: "resturant-5b1c2.firebasestorage.app",
  messagingSenderId: "49924620316",
  appId: "1:49924620316:web:91cc4d5c72182b8cfb5fd9",
  measurementId: "G-H3QE260EET"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);

export { 
  app, 
  analytics, 
  db, 
  auth, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc 
};
