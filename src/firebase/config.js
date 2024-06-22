import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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
  const auth = getAuth(app);
  const db = getFirestore(app);
  console.log('Firestore initialized:', db);
  export { auth, db };
