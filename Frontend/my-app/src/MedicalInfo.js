// src/MedicalInfo.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedicalInfo = () => {
  const [medicationData, setMedicationData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

    const sampleData = {
      name: "Ibuprofen",
      dosage: "200mg",
      interactions: ["Aspirin", "Blood Thinners", "Alcohol"],
      sideEffects: ["Nausea", "Dizziness", "Stomach pain", "Rash"],
    };

    setMedicationData(sampleData);
    setLoading(false);
  }, );
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
        <p>{medicationData.name}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Dosage</h2>
        <p>{medicationData.dosage}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Interactions</h2>
        <ul>
          {medicationData.interactions.map((interaction, index) => (
            <li key={index}>{interaction}</li>
          ))}
        </ul>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Side Effects</h2>
        <ul>
          {medicationData.sideEffects.map((effect, index) => (
            <li key={index}>{effect}</li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default MedicalInfo;
