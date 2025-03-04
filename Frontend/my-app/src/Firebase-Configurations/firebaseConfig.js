// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbkEJqvcZNdJtuXKMShWAvBbK0OUWEUMk",
  authDomain: "mediscanner-1ffd7.firebaseapp.com",
  projectId: "mediscanner-1ffd7",
  storageBucket: "mediscanner-1ffd7.appspot.com",
  messagingSenderId: "577799671388",
  appId: "1:577799671388:web:2d05f14f15810b8b02a099",
  measurementId: "G-EC2FHE6G89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
//const colRef = collection(db, 'users')

export {db, auth};