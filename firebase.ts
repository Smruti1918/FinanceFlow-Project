import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA7kwmMvcZv14aKhrbGRg7xxvZ-W2JggBM",
  authDomain: "financeflow-41194.firebaseapp.com",
  projectId: "financeflow-41194",
  storageBucket: "financeflow-41194.firebasestorage.app",
  messagingSenderId: "5455123258",
  appId: "1:5455123258:web:bedf33a9b2196fd097b603"
};

// Singleton initialization pattern for the Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Explicit service registration
const auth = getAuth(app);
const db = getFirestore(app);

export const isFirebaseConfigured = true;
export { auth, db, app };