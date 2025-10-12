import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCp70J79LHEp1LywnhAzVVMYmyg4xt4Lg4",
  authDomain: "parfumkuscam.firebaseapp.com",
  projectId: "parfumkuscam",
  storageBucket: "parfumkuscam.firebasestorage.app",
  messagingSenderId: "930629992373",
  appId: "1:930629992373:web:7432f9d20645ebbbbca3fc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
