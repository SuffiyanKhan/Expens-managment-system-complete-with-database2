import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
// firestore

const firebaseConfig = {
  apiKey: "AIzaSyCITZ4JaopBdwHUmD_KcV5JPf1nk22qiKE",
  authDomain: "signup-and-login-18814.firebaseapp.com",
  projectId: "signup-and-login-18814",
  storageBucket: "signup-and-login-18814.appspot.com",
  messagingSenderId: "761955324033",
  appId: "1:761955324033:web:650f3ca9b0849ec453bd80",
  measurementId: "G-ZFLC2N7BXB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


