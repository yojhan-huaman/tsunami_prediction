// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC8zaUun4l86U4igHzFfFuUYPjZD-yr_2Y",
  authDomain: "tsunami-prediction-2025.firebaseapp.com",
  projectId: "tsunami-prediction-2025",
  storageBucket: "tsunami-prediction-2025.appspot.com",
  messagingSenderId: "909213644881",
  appId: "1:909213644881:web:2c893231b6808a531b2070",
  measurementId: "G-8X81DSHRDM",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

// (opcional) Inicializar Analytics si se usa en el navegador
export const analytics = getAnalytics(app);