/**
 * to fix
 * - button + functionality to add saved meds to calendar
 * - button + functionality to add reminders
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteMedication, retrieveUserInformation } from "./Firebase-Configurations/firestore.js"
import { auth } from './Firebase-Configurations/firebaseConfig';
import DPDClient from './backend/DPD_Axios.js';
import LNPHDClient from './backend/NPN_Axios.js'

const SavedMedications = () => {
  const [savedMedications, setSavedMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(null);  
  const navigate = useNavigate();


  const getMedication = async (medID) => {
    try {
      if(medID.slice(0, 3) === "DIN"){
        const client = new DPDClient();
        const med = await client.getAllInfo(medID.slice(3));
        return med;
      }
      else if(medID.slice(0, 3) === "NPN"){
        const client = new LNPHDClient();
        const med = await client.getAllInfo(medID.slice(3));
        return med;
      }
    } catch (err) {
      console.error(err);
    }
  };


  const retrieveMedications = async (id) => {
    try {
      const userInfo = await retrieveUserInformation(id)
      for(let i = 0; i < userInfo.savedMedications.length; i++){
        var med = await getMedication(userInfo.savedMedications[i].dIN);
        userInfo.savedMedications[i]["id"] = i;
        userInfo.savedMedications[i]["name"] = med.productInfo[0].brand_name;
        userInfo.savedMedications[i]["dosage"] = `${ (med.activeIngredients[0].dosage_unit === "") ? `${med.activeIngredients[0].strength} ${med.activeIngredients[0].strength_unit}` : `${med.activeIngredients[0].dosage_unit} ${med.activeIngredients[0].dosage_value}`}`;


        const medInformation = { "Drug Name": "TYLENOL LIQUID GELS", "Active Ingredient(s) & Strength": "Acetaminophen 325 mg", "Indications": "Temporary relief of mild to moderate pain and reduction of fever associated with conditions such as headache, muscle pain, arthritis pain, backache, toothache, menstrual cramps, and colds and flu", "Common Side Effects": [ "Nausea", "Vomiting", "Constipation", "Headache", "Drowsiness" ], "Serious Side Effects": [ "Severe skin reactions (e.g., Stevens-Johnson syndrome, toxic epidermal necrolysis)", "Liver damage or failure", "Allergic reactions (e.g., rash, itching, swelling, severe dizziness, difficulty breathing)" ], "Contraindications": [ "Hypersensitivity to acetaminophen or any ingredients in the formulation", "Severe liver disease" ], "Warnings & Precautions": [ "Do not exceed recommended dose", "Alcohol users should consult a doctor before use", "Use caution in patients with liver or kidney disease", "Not recommended for use during pregnancy or breastfeeding without consulting a healthcare professional", "May cause drowsiness; use caution when driving or operating machinery" ], "Drug Interactions": [ "Other acetaminophen-containing products", "Alcohol", "Warfarin", "Carbamazepine", "Isoniazid" ] }


        userInfo.savedMedications[i]["interactions"] = medInformation["Drug Interactions"];
        userInfo.savedMedications[i]["sideEffects"] = [...medInformation["Common Side Effects"], ...medInformation["Serious Side Effects"]];
        userInfo.savedMedications[i]["warnings"] = medInformation["Warnings & Precautions"];
      }
      setSavedMedications(userInfo.savedMedications)
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    // Check for the authenticated user
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUserID(currentUser.uid);
        retrieveMedications(currentUser.uid);
      } else {
        setUserID(null);  // user is logged out
        navigate('/login');  // redirect to login for now
      }
    });
  
    return () => unsubscribe(); // cleanup
  }, [navigate]);


  const handleDelete = (medicationDeleting) => {
    // Confirmation dialog
    const confirmed = window.confirm("Are you sure you want to delete this medication from your profile?");
    if (!confirmed) return;

    // update state to remove med using id (change if it's stored differently)
    setSavedMedications((prev) => prev.filter((medication) => medication.id !== medicationDeleting.id));
    deleteMedication(userID, medicationDeleting.endDate, medicationDeleting.frequency, medicationDeleting.frequencyUnit, medicationDeleting.startDate, medicationDeleting.dIN);
    // api call to delete
  };

  if (loading) {
    return <p>Loading your saved medications...</p>;
  }

  if (savedMedications.length === 0) {
    return <p>You have no saved medications.</p>;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Saved Medications</h1>
      <br/>
      <div>
        {savedMedications.map((medication) => (
          <div
            key={medication.id}
            style={{
              border: '1px solid #6b83ff',
              borderRadius: '5px',
              padding: '15px',
              marginBottom: '10px',
            }}
          >
            <h2 style={{ margin: 0 }}>{medication.name}</h2>
            <p><strong>Dosage:</strong> {medication.dosage}</p>
            <p><strong>Interactions:</strong></p>
            <ul>
              {medication.interactions.map((interaction, index) => (
                <li key={index}>{interaction|| "Unknown"}</li>
              ))}
            </ul>
            <p><strong>Side Effects:</strong></p>
            <ul>
              {medication.sideEffects.map((effect, index) => (
                <li key={index}>{effect|| "Unknown"}</li>
              ))}
            </ul>
            <p><strong>Warnings:</strong></p>
            <ul>
              {medication.warnings.map((warning, index) => (
                <li key={index}>{warning|| "Unknown"}</li>
              ))}
            </ul>
            <button
              onClick={() => handleDelete(medication)}
              style={{
                backgroundColor: '#ff4d4d',
                color: 'white',
                padding: '8px 15px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedMedications;
