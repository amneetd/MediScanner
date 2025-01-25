import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    setDoc,
    getDoc,
    doc,
    updateDoc,
    deleteField,
  } from "firebase/firestore";
import { db } from "./firebaseConfig";
  
const usersCollectionRef = collection(db, "users");

export const retrieveUserInformation = async (userUID) => {
    try{
        const docRef = doc(db, "users", userUID);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            console.log("Document Data", docSnap.data())
        }
        else{
            console.log("No document exists for this user")
        }
    }
    catch{
        console.log("Error getting document");
    }
}

