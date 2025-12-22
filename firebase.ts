
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

// NOTE: These are placeholder values. In a production app, these should be 
// replaced with actual Firebase configuration from the Firebase Console.
const firebaseConfig = {
  apiKey: "AIzaSy_FAKE_KEY_FOR_DEMO",
  authDomain: "ecotracker-demo.firebaseapp.com",
  projectId: "ecotracker-demo",
  storageBucket: "ecotracker-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
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
