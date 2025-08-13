// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPzn5rDU8NovZAWRgTx150CSGiWaemwBE",
  authDomain: "firestore-grafica-d098a.firebaseapp.com",
  projectId: "firestore-grafica-d098a",
  storageBucket: "firestore-grafica-d098a.firebasestorage.app",
  messagingSenderId: "944657177983",
  appId: "1:944657177983:web:0a2835c73a84040651ce4a",
  measurementId: "G-MLHC3V8TK7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exportar la instancia de Firestore para usarla en otros componentes
export const db = getFirestore(app);