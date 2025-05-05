import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBhEEYG_DOHg_MyXEpxA3Fjf5goiagvSU",
  authDomain: "weblab-d6839.firebaseapp.com",
  projectId: "weblab-d6839",
  storageBucket: "weblab-d6839.firebasestorage.app",
  messagingSenderId: "179146316759",
  appId: "1:179146316759:web:d13f8b79f9af22b388c992",
  measurementId: "G-BYT6M91WDE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db=getFirestore(app)
export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,db };
