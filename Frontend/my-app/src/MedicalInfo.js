// src/MedicalInfo.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveMedication } from "./Firebase-Configurations/firestore.js"
import { auth } from './Firebase-Configurations/firebaseConfig';
import ConfirmMedicationInfo from './ConfirmMedicationInfo.js';
import { useLocation } from "react-router-dom";
import DPDClient from './backend/DPD_Axios.js';
import LNPHDClient from './backend/NPN_Axios.js'

const MedicalInfo = () => {
  const [medicationData, setMedicationData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedMedications, setSavedMedications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [userID, setUserID] = useState(null);
  const [amountOfTime, setAmountOfTime] = useState("");  
  const [hideShowDropdown, setHideShowDropdown] = useState(true); 
  const [selectedUnit, setSelectedUnit] = useState("Select Unit"); 
  const [startDate, setStartDate] = useState(null); 
  const [startTime, setStartTime] = useState(null); 
  const [endDate, setEndDate] = useState(""); 
  const [endTime, setEndTime] = useState(""); 
  const [takingIndefinitely, setTakingIndefinitely] = useState(false);
  const [confirmInfoPopup, setConfirmInfoPopup] = useState(false);  
  const location = useLocation();
  const medicationIdentifier = location.state;


  const getMedication = async (medID) => {
    try {
      if(medID.slice(0, 3) === "DIN"){
        const client = new DPDClient();
        const med = await client.getAllInfo(medID.slice(3));


        const medInformation = { "Drug Name": "TYLENOL LIQUID GELS", "Active Ingredient(s) & Strength": "Acetaminophen 325 mg", "Indications": "Temporary relief of mild to moderate pain and reduction of fever associated with conditions such as headache, muscle pain, arthritis pain, backache, toothache, menstrual cramps, and colds and flu", "Common Side Effects": [ "Nausea", "Vomiting", "Constipation", "Headache", "Drowsiness" ], "Serious Side Effects": [ "Severe skin reactions (e.g., Stevens-Johnson syndrome, toxic epidermal necrolysis)", "Liver damage or failure", "Allergic reactions (e.g., rash, itching, swelling, severe dizziness, difficulty breathing)" ], "Contraindications": [ "Hypersensitivity to acetaminophen or any ingredients in the formulation", "Severe liver disease" ], "Warnings & Precautions": [ "Do not exceed recommended dose", "Alcohol users should consult a doctor before use", "Use caution in patients with liver or kidney disease", "Not recommended for use during pregnancy or breastfeeding without consulting a healthcare professional", "May cause drowsiness; use caution when driving or operating machinery" ], "Drug Interactions": [ "Other acetaminophen-containing products", "Alcohol", "Warfarin", "Carbamazepine", "Isoniazid" ] }


        med["interactions"] = medInformation["Drug Interactions"];
        med["sideEffects"] = [...medInformation["Common Side Effects"], ...medInformation["Serious Side Effects"]];
        med["warnings"] = medInformation["Warnings & Precautions"];
        setMedicationData(med);
        setLoading(false);
      }
      else if(medID.slice(0, 3) === "NPN"){
        const client = new LNPHDClient();
        const med = await client.getAllInfo(medID.slice(3));
        med["interactions"] = ["Aspirin", "Blood Thinners", "Alcohol"];
        med["sideEffects"] = ["Nausea", "Dizziness", "Stomach pain", "Rash"];
        setMedicationData(med);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUserID(currentUser.uid);
      } else {
        setUserID(null);  // user is logged out
      }
    });

    console.log("Identifier: ",medicationIdentifier)
    if(medicationIdentifier){
      getMedication(medicationIdentifier)
    }
  }, []);


  const handleConfirmSave = (selectedOption) => {
    if(selectedOption === "Yes"){
      setSavedMedications((prev) => [...prev, medicationData]);
      saveMedication(userID, (takingIndefinitely) ? "indefinitely" :`${endDate}T${endTime}:00`, amountOfTime, selectedUnit, `${startDate}T${startTime}:00`, medicationIdentifier)
      console.log("Medication saved:", medicationData);
      setConfirmInfoPopup(false);
      alert(`${medicationData.name} has been saved. You can now view it under the 'Saved Medications' tab`);
    }
    else{
      setConfirmInfoPopup(false);
    }
    console.log("handles confirmation of save", selectedOption)
  }


  const handleSave = () => {
    if (medicationData && startDate && startTime && (endDate || takingIndefinitely) && (endTime || takingIndefinitely) && selectedUnit !== "Select Unit" && amountOfTime.length > 0) {
      setConfirmInfoPopup(true);
    }
    else if(!startDate){
      alert("Please enter a start date for the medication.")
    }
    else if(!startTime){
      alert("Please enter a start time for the medication.")
    }
    else if(!endDate){
      alert("Please enter a end date for the medication or check the indefinite box if taking the medication for an indefinite amount of time.")
    }
    else if(!endTime){
      alert("Please enter a end time for the medication.")
    }
    else if(selectedUnit === "Select Unit"){
      alert("Please select the unit of time for between each dosage.")
    }
    else if(amountOfTime.length < 1){
      alert("Please enter the time between each dosage.")
    }
  };

  const handleSetReminder = () => {
    if (!medicationData.dosage.toLowerCase().includes("daily")) {
      alert("Unable to set a reminder for this dosage.");
      return;
    }

    // get the dosage --> using daily for now
    const reminder = {
      id: Date.now(),
      name: medicationData.name,
      dosage: medicationData.dosage,
    };

    setReminders((prev) => [...prev, reminder]);
    alert(`Reminder set for ${medicationData.name} (${medicationData.dosage}).`);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in this browser.');
    }
  };

  if (!medicationIdentifier) {
    return <p>No medication scanned.</p>;
  }

  if (loading) {
    return <p>Loading your medical information. Please wait</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      
      {confirmInfoPopup && <ConfirmMedicationInfo 
                              startOn={`${startDate} At ${startTime}`} 
                              endOn={(takingIndefinitely) ? "Taking Indefinitely" : `${endDate} At ${endTime}`} 
                              frequency={`${amountOfTime} ${selectedUnit}`} 
                              handleConfirmation={handleConfirmSave}
                            />}

      <h1 style={{ color: '#333' }}>Medical Information</h1>
      <br/>

      <div style={{ marginBottom: '20px' }}>
        <h2>Medication Name</h2>
        <div style={{flexDirection: 'row', display: 'flex'}}>
        <p>{medicationData.productInfo[0].brand_name}</p>
        <button
          onClick={() => speakText(`Medication Name: ${medicationData.productInfo[0].brand_name}`)}
          style={{
            backgroundColor: '#6b83ff',
            color: 'white',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '20px'
          }}
        >
          Speak Name
        </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Dosage</h2>
        <div style={{flexDirection: 'row', display: 'flex'}}>

        <p>{`${ (medicationData.activeIngredients[0].dosage_unit === "") ? `${medicationData.activeIngredients[0].strength} ${medicationData.activeIngredients[0].strength_unit}` : `${medicationData.activeIngredients[0].dosage_unit} ${medicationData.activeIngredients[0].dosage_value}`}` + ` ${(userID) ? "every" : ""} `}</p>
        {(userID) ? <div>
          <input onChange={e => setAmountOfTime(e.target.value)} placeholder='12' type='number'
          style={{
            height: '50px',
            width: '40px',
            fontSize: 16,
            borderColor: '#6B83FF',
            borderWidth: '1px',
            margin: '0px 10px 0px 10px'
          }}>
          </input>
          <div style={{
              position: "relative",
              display: "inline-block",
          }}>
            <button onClick={e => {setHideShowDropdown(!hideShowDropdown); console.log(hideShowDropdown)}}
              style={{
                height: '50px',
                width: '80px',
                backgroundColor: 'white',
                borderColor: '#6B83FF',
                borderWidth: '1px'
              }}>
                {selectedUnit}
            </button>
            <div style={(hideShowDropdown) ? 
              {display: 'none'} : 
              {
                display: 'grid',
                gridTempleColumns: 'auto',
                zIndex: 1,
                position: 'absolute',
              }}>
              <button onClick={e => {setSelectedUnit("Hours"); setHideShowDropdown(!hideShowDropdown);}}
              style={(selectedUnit === 'Hours') ? {
                height: '50px',
                width: '80px',
                backgroundColor: '#EAEAEA',
                borderColor: '#6B83FF',
                borderWidth: '0px 1px 0px 1px'
              } : 
              { 
                height: '50px',
                width: '80px',
                backgroundColor: 'white',
                borderColor: '#6B83FF',
                borderWidth: '0px 1px 0px 1px'}}
              >Hours</button>
              <button onClick={e => {setSelectedUnit("Days"); setHideShowDropdown(!hideShowDropdown);}}
                style={(selectedUnit === 'Days') ? {
                  height: '50px',
                  width: '80px',
                  backgroundColor: '#EAEAEA',
                  borderColor: '#6B83FF',
                  borderWidth: '0px 1px 0px 1px'
                } : 
                { 
                  height: '50px',
                  width: '80px',
                  backgroundColor: 'white',
                  borderColor: '#6B83FF',
                  borderWidth: '0px 1px 0px 1px'}}
              >Days</button>
              <button onClick={e => {setSelectedUnit("Weeks"); setHideShowDropdown(!hideShowDropdown);}}
                style={(selectedUnit === 'Weeks') ? {
                  height: '50px',
                  width: '80px',
                  backgroundColor: '#EAEAEA',
                  borderColor: '#6B83FF',
                  borderWidth: '0px 1px 1px 1px'
                } : 
                { 
                  height: '50px',
                  width: '80px',
                  backgroundColor: 'white',
                  borderColor: '#6B83FF',
                  borderWidth: '0px 1px 1px 1px'}}
              >Weeks</button>
            </div>
          </div>
        </div>
        :
        ""}
        <button
          onClick={() => speakText(`Dosage: ${`${ (medicationData.activeIngredients[0].dosage_unit === "") ? `${medicationData.activeIngredients[0].strength} ${medicationData.activeIngredients[0].strength_unit}` : `${medicationData.activeIngredients[0].dosage_unit} ${medicationData.activeIngredients[0].dosage_value}`}`} ${(userID) ? `every ${amountOfTime} ${selectedUnit}` : ""}`)}
          style={{
            backgroundColor: '#6b83ff',
            color: 'white',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '20px'
          }}
        >
          Speak Dosage
        </button>
        </div>
      </div>

      {(userID) ? <div style={{ marginBottom: '20px' }}>
        <h2>Start Taking On</h2>
        <div style={{flexDirection: 'row', display: 'flex'}}>
        <input type="date" onChange={e => setStartDate(e.target.value)}></input>
        <input type="time" onChange={e => setStartTime(e.target.value)}
        style={{
          width: '100px',
          marginLeft: '20px'
        }}>
        </input>
        <button
          onClick={() =>
            speakText(`Start taking on ${startDate} at ${startTime}`)
          }
          style={{
            backgroundColor: '#6b83ff',
            color: 'white',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '20px'
            //fix the button size (make it absolute, not dynamic)
          }}
        >
          Speak Start Date
        </button>
        </div>
      </div>
      :
      ""}

      {(userID) ? <div style={{ marginBottom: '20px' }}>
        <h2>Finish Taking On</h2>
        <div style={{flexDirection: 'row', display: 'flex'}}>
        <input type="date" onChange={e => setEndDate(e.target.value)} disabled={takingIndefinitely} value={endDate}></input>
        <input type="time" onChange={e => setEndTime(e.target.value)} disabled={takingIndefinitely} value={endTime}
        style={{
          width: '100px',
          marginLeft: '20px'
        }}>
        </input>
        <button
          onClick={() =>
            speakText((takingIndefinitely) 
            ? 
            "No finish date. Taking for an indefinite amount of time" 
            : 
            `Finish taking on ${endDate} at ${endTime}`)
          }
          style={{
            backgroundColor: '#6b83ff',
            color: 'white',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '20px'
            //fix the button size (make it absolute, not dynamic)
          }}
        >
          Speak End Date
        </button>
        </div>
        <input type='checkbox' id='taking-indefinitely' onChange={e => {setTakingIndefinitely(e.target.checked); setEndDate(""); setEndTime("")}}
          style={{
            marginTop: '20px'
          }}>
        </input>
        <label htmlFor='taking-indefinitely'>Taking Indefinitely</label>
      </div>
      :
      ""}

      <div style={{ marginBottom: '20px' }}>
        <h2>Interactions</h2>
        <div style={{flexDirection: 'row', display: 'flex'}}>
        <ul>
          {medicationData.interactions.map((interaction, index) => (
            <li key={index}>{interaction}</li>
          ))}
        </ul>
        <button
          onClick={() =>
            speakText(
              `Interactions: ${medicationData.interactions.join(', ')}`
            )
          }
          style={{
            backgroundColor: '#6b83ff',
            color: 'white',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '20px'
            //fix the button size (make it absolute, not dynamic)
          }}
        >
          Speak Interactions
        </button>
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Side Effects</h2>
        <div style={{flexDirection: 'row', display: 'flex'}}>
        <ul>
          {medicationData.sideEffects.map((effect, index) => (
            <li key={index}>{effect}</li>
          ))}
        </ul>
        <button
          onClick={() =>
            speakText(`Side Effects: ${medicationData.sideEffects.join(', ')}`)
          }
          style={{
            backgroundColor: '#6b83ff',
            color: 'white',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '20px'
            //fix the button size (make it absolute, not dynamic)

          }}
        >
          Speak Side Effects
        </button>
        </div>
      </div>
      {(userID) ? <button 
        onClick={handleSave} 
        style={{
          backgroundColor: '#6b83ff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Save this Medication
      </button>
      :
      ""}
      <br/>
    </div>
  );
};

export default MedicalInfo;
