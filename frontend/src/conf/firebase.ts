// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmtMvlI5nGRzHAhAyrrUGHcdL99oiOJG0",
  authDomain: "automationsaas-9e6b1.firebaseapp.com",
  projectId: "automationsaas-9e6b1",
  storageBucket: "automationsaas-9e6b1.firebasestorage.app",
  messagingSenderId: "922015030111",
  appId: "1:922015030111:web:185273a02d95ebd81974ea",
  measurementId: "G-ZN6B5CXE98"
};


const firebase_app = initializeApp(firebaseConfig);

const firebase_auth = getAuth(firebase_app);
const google_provider = new GoogleAuthProvider();

export { firebase_auth, google_provider, firebase_app };

