// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

import {
  getFirestore,
} from "firebase/firestore";

import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABIF_5jDBV4Y1NfyF0c7oDT8p9YGFXpKY",
  authDomain: "document-management-syst-a53e1.firebaseapp.com",
  projectId: "document-management-syst-a53e1",
  storageBucket: "document-management-syst-a53e1.appspot.com",
  messagingSenderId: "123956338243",
  appId: "1:123956338243:web:74b52a89936d40090abef6",
  measurementId: "G-CW65HMXZEJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Instatiation Database Connection

export const db = getFirestore(app);
export const storage = getStorage(app);








