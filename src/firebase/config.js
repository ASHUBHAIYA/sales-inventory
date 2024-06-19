import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAwIKeDeXgn3enqpQJuTji2LVkPuy4Bb44",
    authDomain: "sales-inventory-9de6e.firebaseapp.com",
    projectId: "sales-inventory-9de6e",
    storageBucket: "sales-inventory-9de6e.appspot.com",
    messagingSenderId: "875167558520",
    appId: "1:875167558520:web:3bcba74987e9feed82368d"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

export { db };
