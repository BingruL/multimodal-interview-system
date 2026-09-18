// src/utils/realtimeService.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, onSnapshot } from 'firebase/firestore';

export const initializeFirebase = (firebaseConfig) => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  return { auth, db };
};

export const signInAnonymouslyToFirebase = async (auth) => {
  return await signInAnonymously(auth);
};

export const addInterviewHistory = async (db, appId, userId, newEntry) => {
  await addDoc(collection(db, `artifacts/${appId}/users/${userId}/interviewHistory`), newEntry);
};