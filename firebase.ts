
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

// Firebase configuration for EcoTracker project (Hosting + Auth)
const firebaseConfig = {
  apiKey: "AIzaSyAJaUuXNY4oi3bW6pPOi0YlkTengFkdBQM",
  authDomain: "ecotracker-12f5f.firebaseapp.com",
  projectId: "ecotracker-12f5f",
  storageBucket: "ecotracker-12f5f.firebasestorage.app",
  messagingSenderId: "959154506986",
  appId: "1:959154506986:web:f85e2de96052143ca01b93"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
};
export type { User };
