import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  setDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
// Constants
const CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

export default class FirebaseClass {
  // Firebase init
  app = initializeApp(CONFIG);
  auth = getAuth(this.app);
  storage = getStorage(this.app);
  db = getFirestore(this.app);
  DATE_NOW = new Date().toLocaleString();

  // Collections
//   projectsCollection = collection(this.db, "projects");
//   contractsCollection = collection(this.db, "contracts");
//   guildsCollection = collection(this.db, "guild_communities");
//   coinsCollection = collection(this.db, "coins");

//   async getSlugs() {
//     //Get all contract object in the database and return their id
//     const slugs: string[] = [];
//     const querySnapshot = await getDocs(this.contractsCollection);
//     querySnapshot.forEach((doc) => {
//       slugs.push(doc.id);
//     });
//     if (!slugs) return [];
//     return slugs;
//   }
}
