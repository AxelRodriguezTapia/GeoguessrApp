// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDZGTV6zFlODhDVw2apwNuE3rvNl0OTDsY",
  authDomain: "geoguessr-d45a3.firebaseapp.com",
  projectId: "geoguessr-d45a3",
  storageBucket: "geoguessr-d45a3.firebasestorage.app",
  messagingSenderId: "989444869283",
  appId: "1:989444869283:web:a6ee328ddec7fc293a8316",
  measurementId: "G-XPGB535M1C"
};
// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };