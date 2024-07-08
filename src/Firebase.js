// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyAgXnE7W_n1Mk_3iKFpici7seaEU0UuUi8",
  authDomain: "chatapp-f6973.firebaseapp.com",
  projectId: "chatapp-f6973",
  storageBucket: "chatapp-f6973.appspot.com",
  messagingSenderId: "440171779838",
  appId: "1:440171779838:web:5ca18683d438ee844c37af",
  measurementId: "G-3NK4CE67JV"
};


export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);