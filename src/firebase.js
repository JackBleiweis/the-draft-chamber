// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDX2-3yRhtFF03JIObNOEKdp-0kuvLCGw0",
  authDomain: "the-draft-chamber.firebaseapp.com",
  projectId: "the-draft-chamber",
  storageBucket: "the-draft-chamber.firebasestorage.app",
  messagingSenderId: "673166888924",
  appId: "1:673166888924:web:1aede801ea314fcba00919",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
