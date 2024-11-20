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
              border: '1px solid #ddd',
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedMedications;
