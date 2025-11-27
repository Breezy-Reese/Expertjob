import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBKihsR4MTMGG9qg7Cb-cf3wx3Vg-8gmxc",
  authDomain: "expertjobs-3f678.firebaseapp.com",
  projectId: "expertjobs-3f678",
  storageBucket: "expertjobs-3f678.firebasestorage.app",
  messagingSenderId: "754056931169",
  appId: "1:754056931169:android:edb8ae1356cffc67aa4720"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;