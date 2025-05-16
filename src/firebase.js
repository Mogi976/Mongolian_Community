import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_rR3irGG9Ee0OY4B9ueMV5OPR4x9WU_s",
  authDomain: "moncom-487a6.firebaseapp.com",
  projectId: "moncom-487a6",
  storageBucket: "moncom-487a6.firebasestorage.app",
  messagingSenderId: "933141876923",
  appId: "1:933141876923:web:7a6632ad7682348230199e",
  measurementId: "G-QNR8R2XTRB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
