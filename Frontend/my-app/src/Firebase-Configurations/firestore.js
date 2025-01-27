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
    arrayUnion, 
    arrayRemove
  } from "firebase/firestore";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    updateProfile, 
    updatePhoneNumber, 
    updatePassword, 
    reauthenticateWithCredential, 
    EmailAuthProvider 
    } from "firebase/auth";
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
        savedMedications: []
      });
}


export const registerUser = async (username, email, phoneNumber, password) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("current User", auth.currentUser)
        createNewDocument(user.uid)
        updateProfile(auth.currentUser, {
            displayName: username
        })
        console.log(user)
      })
      .catch((error) => {
        console.log(error)
      });
}


export const saveMedication = async (userUID) => {
    const docRef = doc(db, "users", userUID);
    await updateDoc(docRef, {
        savedMedications: arrayUnion({
            currentlyTaking: false,
            dosage: 300,
            endDate: "",
            frequency: "",
            medicationName: "",
            startDate: ""
        })
    });
}


export const deleteMedication = async (userUID) => {
    const docRef = doc(db, "users", userUID);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data())
    await updateDoc(docRef, {
        savedMedications: arrayRemove({
            currentlyTaking: false,
            dosage: 300,
            endDate: "",
            frequency: "",
            medicationName: "",
            startDate: ""
        })
    });
}


export const changeUsersPassword = async (newPassword) => {
    const auth = getAuth();

    const user = auth.currentUser;
    console.log(user)
    const userCredential = EmailAuthProvider.credential(user.email, "password")
    reauthenticateWithCredential(user, userCredential).then(() => {
        updatePassword(user, newPassword).then(() => {
            console.log("updated password")
        }).catch((error) => {
            console.log(error)
        });
    }).catch((error) => {
        console.log(error)
    });
}