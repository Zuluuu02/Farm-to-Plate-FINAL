import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfcuLBiErTafNtVt29XEGYTFGrjSlmyns",
  authDomain: "farm-to-plate-project.firebaseapp.com",
  projectId: "farm-to-plate-project",
  storageBucket: "farm-to-plate-project.firebasestorage.app",
  messagingSenderId: "103013854045",
  appId: "1:103013854045:web:fb5998ada3f8257fa916b4",
  measurementId: "G-ZEDXEF1G52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db};