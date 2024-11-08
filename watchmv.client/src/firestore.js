import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBZZfcuYT53PCwxrNx2ONJqPTko9M8Nucw",
    authDomain: "murointeractivo-7efbb.firebaseapp.com",
    projectId: "murointeractivo-7efbb",
    storageBucket: "murointeractivo-7efbb.appspot.com",
    messagingSenderId: "620822233110",
    appId: "1:620822233110:web:80dd429b174b6d36983537"
};

export const app = initializeApp(firebaseConfig);
export const firestoreInstance = getFirestore(app);