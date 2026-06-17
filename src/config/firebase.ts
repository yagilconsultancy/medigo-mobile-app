import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZCXntRnN_rJNSI2qV2qYT1GAxg3Ublr8",
  authDomain: "netzence-97078.firebaseapp.com",
  databaseURL: "https://netzence-97078-default-rtdb.firebaseio.com",
  projectId: "netzence-97078",
  storageBucket: "netzence-97078.appspot.com",
  messagingSenderId: "571920347452",
  appId: "1:571920347452:web:5a1a4b0baab7ee9083ee39",
  measurementId: "G-4DGGXDTPDX",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getDatabase(app);
export const database = getDatabase(app);
