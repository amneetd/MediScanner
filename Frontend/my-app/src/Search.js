/**
 * to add:
 * - fix styling
 * - add reminder functionality
 * - more refinement for the search (options to include dosages or other information)
 */

import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicationData, setMedicationData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedMedications, setSavedMedications] = useState([]);

  const handleSearch = () => {
    if (!searchTerm) {
      setError('Please enter a medication name.');
      return;
    }

    setLoading(true);
    setError(null);

    // replace w/ api endpoint
    //const apiUrl = '';

//test info 
    setTimeout(() => {
      const sampleData = {
        name: "Ibuprofen",
        dosage: "200mg",
        interactions: ["Aspirin", "Blood Thinners", "Alcohol"],
        sideEffects: ["Nausea", "Dizziness", "Stomach pain", "Rash"],
      };

      if (searchTerm.toLowerCase() === 'ibuprofen') {
        setMedicationData(sampleData);
        setLoading(false);
      } else {
        setError(`No data found for "${searchTerm}".`);
        setLoading(false);
      }
    }, 1000);

    /*
    axios
      .get(apiUrl)
      .then((response) => {
        setMedicationData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error getting this medication:", error);
        setError("We were unable to find information about this medication.");
        setLoading(false);
      });
    */
  };

  const handleSave = () => {
    if (medicationData) {
      setSavedMedications((prev) => [...prev, medicationData]);
      alert(`${medicationData.name} has been saved. You can now view it under the 'Saved Medications' tab.`);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in this browser.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>Search for a Medication</h1>
      <br/>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter your medication here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            marginRight: '10px',
            textAlign: 'center',
            position: 'absolute', left: '47%', transform: 'translateX(-53%)',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            backgroundColor: '#6b83ff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            position: 'absolute', left: '61%', transform: 'translateX(-39%)',
          }}
        >
          Search
        </button>
        <br/>

      </div>
      {loading && <p style={{textAlign: 'center'}}>Loading medication information...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {medicationData && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3>Medication Name</h3>
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
            <h3>Dosage</h3>
            <div style={{flexDirection: 'row', display: 'flex'}}>

        <p>{medicationData.dosage}</p>
        <button
          onClick={() => speakText(`Dosage: ${medicationData.dosage}`)}
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
            <h3>Interactions</h3>
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
          <br/>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: '#6b83ff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            }}
          >
            Save this Medication
          </button>
        </div>
      )}
      {savedMedications.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Saved Medications</h3>
          <ul>
            {savedMedications.map((medication, index) => (
              <li key={index}>{medication.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
