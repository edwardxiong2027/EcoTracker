
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

// Firebase configuration for the project (Hosting under mindmap-9f454 project)
// Hosted at: ecotracker-20251224.web.app
const firebaseConfig = {
  apiKey: "AIzaSyCXEtq0ubgtXIbb7s_JzoWt8daNejKwuLQ",
  authDomain: "ecotracker-20251224.web.app",
  projectId: "mindmap-9f454",
  storageBucket: "mindmap-9f454.firebasestorage.app",
  messagingSenderId: "582191293462",
  appId: "1:582191293462:web:bf853df01d39f9a4538137"
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
