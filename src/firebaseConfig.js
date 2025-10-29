// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8zaUun4l86U4igHzFfFuUYPjZD-yr_2Y",
  authDomain: "tsunami-prediction-2025.firebaseapp.com",
  projectId: "tsunami-prediction-2025",
  storageBucket: "tsunami-prediction-2025.firebasestorage.app",
  messagingSenderId: "909213644881",
  appId: "1:909213644881:web:2c893231b6808a531b2070",
  measurementId: "G-8X81DSHRDM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };