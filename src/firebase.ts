// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDe5tS7m2uexvppyx6m2M7JjTtVkTv_41g",
  authDomain: "tennis-match-manager.firebaseapp.com",
  projectId: "tennis-match-manager",
  storageBucket: "tennis-match-manager.appspot.com",
  messagingSenderId: "596956607701",
  appId: "1:596956607701:web:3e7c6de1e6cdac62561e5c",
  measurementId: "G-54QTPEQB09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
