// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import firebase from 'firebase'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvcuE5qEQJgNoRZhyQ3l5dwQ9wqvZeMI8",
  authDomain: "certain-mission-298808.firebaseapp.com",
  projectId: "certain-mission-298808",
  storageBucket: "certain-mission-298808.appspot.com",
  messagingSenderId: "423648667209",
  appId: "1:423648667209:web:74ed3b536abf5738e98198",
  measurementId: "G-1S7PYCX6RH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);