import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAu1Vul4zp8OD9bGLsM1E1ssnCqaZT1ACw",
    authDomain: "todo-list-ltnam.firebaseapp.com",
    projectId: "todo-list-ltnam",
    storageBucket: "todo-list-ltnam.appspot.com",
    messagingSenderId: "865939992320",
    appId: "1:865939992320:web:8d6dc641b918822907cde5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)