// src/MedicalInfo.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveMedication } from "./Firebase-Configurations/firestore.js"
import { auth } from './Firebase-Configurations/firebaseConfig';

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


  useEffect(() => {
    //our api endpoint -- I'm assuming this is how we're going to do it
    //const apiUrl = x;

    //for when we have it integrated properly
    /*axios
      .get(apiUrl)
      .then((response) => {
        setMedicationData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the medication data:", error);
        setError("We were unable to load your medication information.");
        setLoading(false);
      });
  }, []);
*/
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUserID(currentUser.uid)
      } 
    });

    const sampleData = {
      name: "Ibuprofen",
      dosage: "400mg",
      frequency: "weekly",
      interactions: ["Aspirin", "Blood Thinners", "Alcohol"],
      sideEffects: ["Nausea", "Dizziness", "Stomach pain", "Rash"],
      dIN: 111121
    };

    setMedicationData(sampleData);
    setLoading(false);
  }, []);

  const handleSave = () => {
    if (medicationData) {
      setSavedMedications((prev) => [...prev, medicationData]);
      saveMedication(userID, medicationData.dosage, "finishDate", amountOfTime, selectedUnit, `${startDate}T${startTime}:00`, medicationData.dIN)
      console.log("Medication saved:", medicationData);
      alert(`${medicationData.name} has been saved. You can now view it under the 'Saved Medications' tab`);
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

  if (loading) {
    return <p>Loading your medical information. Please wait</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ color: '#333' }}>Medical Information</h1>
      <br/>

      <div style={{ marginBottom: '20px' }}>
        <h2>Medication Name</h2>
        <div style={{flexDirection: 'row', display: 'flex'}}>
        <p>{medicationData.name}</p>
        <button
          onClick={() => speakText(`Medication Name: ${medicationData.name}`)}
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

        <p>{medicationData.dosage + " every "}</p>
        <input onChange={e => setAmountOfTime(e.target.value)} placeholder='12' type='number'
        style={{
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
                borderWidth: '0px 1px 0px 1px'
              } : 
              { 
                height: '50px',
                width: '80px',
                backgroundColor: 'white',
                borderColor: '#6B83FF',
                borderWidth: '0px 1px 0px 1px'}}
            >Weeks</button>
            <button onClick={e => {setSelectedUnit("Months"); setHideShowDropdown(!hideShowDropdown);}}
              style={(selectedUnit === 'Months') ? {
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
            >Months</button>
          </div>
        </div>
        <button
          onClick={() => speakText(`Dosage: ${medicationData.dosage + " " + medicationData.frequency}`)}
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

      <div style={{ marginBottom: '20px' }}>
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
          Speak Start Date
        </button>
        </div>
      </div>

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
      <button
        onClick={handleSetReminder}
        style={{
          backgroundColor: '#6b83ff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginRight: '10px',
        }}
      >
        Set Reminder
      </button>
      <button 
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
      <br/>
      {savedMedications.length > 0 && ( //right now this just populates below the information --> in the future it would work with the actual saved medications page
  <div style={{ color: '#f7a1e9', marginTop: '10px' }}>
    <h3>Saved Medications:</h3>
    <ul>
      {savedMedications.map((medication, index) => (
        <li key={index}>
          <strong>{medication.name}</strong> - {medication.dosage}
        </li>
      ))}
    </ul>
  </div>
)}
    </div>
  );
};

export default MedicalInfo;
