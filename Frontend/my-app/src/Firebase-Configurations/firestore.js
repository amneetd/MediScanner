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
import { getAuth, createUserWithEmailAndPassword, updateProfile, updatePhoneNumber } from "firebase/auth";
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


export const createNewDocument = async (userUID) => {
    await setDoc(doc(db, "users", userUID), {
        name: "Los Angeles",
        state: "CA",
        country: "USA",
        savedMedications: ["hello"]
      });
}


export const registerUser = async (username, email, phoneNumber, password) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("current User", auth.currentUser)
        updateProfile(auth.currentUser, {
            displayName: username
        })
        console.log(user)
      })
      .catch((error) => {
        console.log(error)
      });
}