import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDv2cIVnmom80Py1MvOOBTTEqvkU8FlAh8",
  authDomain: "video-upload-5d1e0.firebaseapp.com",
  projectId: "video-upload-5d1e0",
  storageBucket: "video-upload-5d1e0.appspot.com",
  messagingSenderId: "345700289423",
  appId: "1:345700289423:web:f99491af4789a8531419fa",
  measurementId: "G-08MQCV7GMK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); 