import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
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
  DocumentData,
} from "firebase/firestore";
import { Recording } from "@/types/Recording";
import { TCallDetails } from "@/types/TCallDetails";

// Constants
const CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export default class FirebaseClass {
  // Firebase init
  app = initializeApp(CONFIG);
  auth = getAuth(this.app);
  storage = getStorage(this.app);
  db = getFirestore(this.app);
  DATE_NOW = new Date().toLocaleString();

  // Collections
  recordingsCollection = collection(this.db, "recordings");

  async deleteRecording(email: string, filename: string) {
    try {
      const docRef = doc(this.db, "recordings", email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const recordings = docSnap.data().recordings;
        const updatedRecordings = recordings.filter(
          (recording: { name: string }) => recording.name !== filename
        );
        await updateDoc(docRef, { recordings: updatedRecordings });
        return updatedRecordings;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getRecording(client_email: string) {
    //Get recordings objects from a specific user in the database and return a list of it
    try {
      const docRef = doc(this.db, "recordings", client_email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().recordings;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async uploadRecording(email: string, file: File) {
    return new Promise<string>((resolve, reject) => {
      const fileRef = ref(
        this.storage,
        `recordings/${email.split("@")[0]}/${file.name.split(".")[0]}-${
          file.name.split(".")[1]
        }`
      );

      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress updates if needed
        },
        (error) => {
          alert(`${error} - Failed to upload file.`);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error("Error writing document: ", error);
            reject(error);
          }
        }
      );
    });
  }

  async updateRecording(
    email: string,
    filename: string,
    downloadURL: string,
    transcription: string,
    chatResponse: string
  ) {
    return new Promise<Recording[]>(async (resolve, reject) => {
      try {
        const recording = {
          name: filename,
          url: downloadURL,
          date: this.DATE_NOW,
          transcription: transcription,
          chatResponse: chatResponse,
        };
        const docRef = doc(this.db, "recordings", email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const recordings: Recording[] = docSnap.data().recordings;
          recordings.push(recording);
          await updateDoc(docRef, { recordings: recordings });
          console.log(recordings);
          resolve(recordings);
        } else {
          await setDoc(docRef, { recordings: [recording] });
          console.log([recording] as Recording[]);
          resolve([recording] as Recording[]);
        }
      } catch (error) {
        console.error("Error writing document: ", error);
        reject(error);
      }
    });
  }

  async updateRecordingName(
    email: string,
    originalName: string,
    newName: string
  ) {
    try {
      const docRef = doc(this.db, "recordings", email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let recordings = docSnap.data().recordings;
        const recordingIndex = recordings.findIndex(
          (r: { name: string }) => r.name === originalName
        );

        if (recordingIndex !== -1) {
          recordings[recordingIndex].name = newName;
          await updateDoc(docRef, { recordings: recordings });
        } else {
          console.log("Recording not found");
          return false;
        }
      } else {
        console.log("No such document!");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error updating recording name: ", error);
      return false;
    }
  }

  async initializeCall(
    caller_id: string,
    receiver_id: string,
    receiver_number: string
  ) {
    const document = doc(collection(this.db, "calls"));
    const callDetails: TCallDetails = {
      call_id: document.id,
      caller_id: caller_id,
      receiver_id: receiver_id,
      receiver_number: receiver_number,
    };

    try {
      await setDoc(document, callDetails);
    } catch (error) {
      console.log(error);
    }

    return document.id;
  }

  async getCallDetails(call_id: string) {
    try {
      const docRef = doc(this.db, `calls/${call_id}`);
      const docSnap = await getDoc(docRef);
      const details = docSnap.data();

      if (details != undefined) return details as TCallDetails;
      else throw new Error("Parameter is not a number!");
    } catch (error) {
      console.log(error);
    }
  }

  // async getRecordings() {
  //   //Get recordings objects from a specific user in the database and return a list of it
  //   const slugs: any[] = [];
  //   const querySnapshot = await getDocs(this.recordingsCollection);
  //   querySnapshot.forEach((recording) => {
  //     slugs.push(recording);
  //   });
  //   if (!slugs) return [];
  //   return slugs;
  // }
}
