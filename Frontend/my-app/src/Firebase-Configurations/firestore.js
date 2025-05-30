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
            return docSnap.data()
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


export const registerUser = async (username, email, password) => {
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


export const updatePrescriptionInstructions = async (userUID, medicationDIN, newEndDate, newFrequency, newFrequencyUnit, newStartDate) => {
    const docRef = doc(db, "users", userUID);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
        const usersMedications = docSnap.data().savedMedications;
        const location = usersMedications.findIndex(medication => medication.dIN === medicationDIN);
        console.log(usersMedications)
        console.log(location)
        if(location > -1){
            usersMedications[location].endDate = newEndDate;
            usersMedications[location].frequency = newFrequency;
            usersMedications[location].frequencyUnit = newFrequencyUnit;
            usersMedications[location].startDate = newStartDate;
            try{
                await updateDoc(docRef, { savedMedications: usersMedications });
            }
            catch(error){
                console.log(error)
            }
        }
    }
}


export const saveMedication = async (userUID, finishDate, howOften, timeUnit, beginOn, drugIDNum) => {
    const docRef = doc(db, "users", userUID);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
        const usersMedications = docSnap.data().savedMedications;
        const location = usersMedications.findIndex(medication => medication.dIN === drugIDNum);
        if(location > -1){
            updatePrescriptionInstructions(userUID, drugIDNum, finishDate, howOften, timeUnit, beginOn);
        }
        else{
            await updateDoc(docRef, {
                savedMedications: arrayUnion({
                    endDate: finishDate,
                    frequency: Number(howOften),
                    frequencyUnit: timeUnit,
                    startDate: beginOn,
                    dIN: drugIDNum
                })
            });
        }
    }
}


export const deleteMedication = async (userUID, finishDate, howOften, timeUnit, beginOn, DrugIDNum) => {
    const docRef = doc(db, "users", userUID);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data())
    console.log(userUID, finishDate, howOften, beginOn, DrugIDNum)
    await updateDoc(docRef, {
        savedMedications: arrayRemove({
            endDate: finishDate,
            frequency: howOften,
            frequencyUnit: timeUnit,
            startDate: beginOn,
            dIN: DrugIDNum
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
