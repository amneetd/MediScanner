/**
 * to fix
 * - button + functionality to add saved meds to calendar
 * - button + functionality to add reminders
 */

import React, { useState, useEffect } from 'react';

const SavedMedications = () => {
  const [savedMedications, setSavedMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testMeds = [
      {
        id: 1,
        name: "Ibuprofen",
        dosage: "330mg",
        interactions: ["x", "xx"],
        sideEffects: ["a", "a"],
      },
      {
        id: 2,
        name: "z",
        dosage: "10mg",
        interactions: ["water"],
        sideEffects: ["sleep"],
      },
    ];

    setSavedMedications(testMeds);
    setLoading(false);

  }, []);
  const handleDelete = (id) => {
    // Confirmation dialog
    const confirmed = window.confirm("Are you sure you want to delete this medication from your profile?");
    if (!confirmed) return;

    // update state to remove med using id (change if it's stored differently)
    setSavedMedications((prev) => prev.filter((medication) => medication.id !== id));

    // api call to delete
    /*
    axios
      .delete(``)
      .then(() => {
        setSavedMedications((prev) => prev.filter((medication) => medication.id !== id));
      })
      .catch((error) => {
        console.error("there was an error deleting this medication:", error);
        alert("Unable to delete medication at this time.");
      });
    */
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
                <li key={index}>{interaction}</li>
              ))}
            </ul>
            <p><strong>Side Effects:</strong></p>
            <ul>
              {medication.sideEffects.map((effect, index) => (
                <li key={index}>{effect}</li>
              ))}
            </ul>
            <button
              onClick={() => handleDelete(medication.id)}
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
