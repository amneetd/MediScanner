// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { deleteMedication, retrieveUserInformation } from "./Firebase-Configurations/firestore.js"
// import { auth } from './Firebase-Configurations/firebaseConfig';
// import DPDClient from './backend/DPD_Axios.js';
// import LNPHDClient from './backend/NPN_Axios.js'
// import MedicationSources from './MedicationSources.js';
// import { retrieveMonograph } from './Monograph.js';

// const SavedMedications = () => {
//   const [savedMedications, setSavedMedications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userID, setUserID] = useState(null);  
//   const navigate = useNavigate();


//   const getMedication = async (medID) => {
//     try {
//       if(medID.slice(0, 3) === "DIN"){
//         const client = new DPDClient();
//         const med = await client.getAllInfo(medID.slice(3));

//         return med;
//       }
//       else if(medID.slice(0, 3) === "NPN"){
//         const client = new LNPHDClient();
//         const med = await client.getAllInfo(medID.slice(3));
//         return med;
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };


//   const retrieveMedications = async (id) => {
//     try {
//       const userInfo = await retrieveUserInformation(id)
//       for(let i = 0; i < userInfo.savedMedications.length; i++){
//         var med = await getMedication(userInfo.savedMedications[i].dIN);
//         userInfo.savedMedications[i]["id"] = i;
//         userInfo.savedMedications[i]["name"] = med.productInfo[0].brand_name;
//         userInfo.savedMedications[i]["dosage"] = `${ (med.activeIngredients[0].dosage_unit === "") ? `${med.activeIngredients[0].strength} ${med.activeIngredients[0].strength_unit}` : `${med.activeIngredients[0].dosage_unit} ${med.activeIngredients[0].dosage_value}`}`;

//         //const medInformation = await retrieveMonograph(userInfo.savedMedications[i].dIN.slice(3), userInfo.savedMedications[i].dIN.slice(0, 3))
//         const medInformation = {
//           "Drug Name": "GRAVOL TABLETS",
//           "Active Ingredient(s) & Strength": "Dimenhydrinate 50 MG",
//           "Indications": [
//               "Prevention and treatment of nausea and vomiting",
//               "Motion sickness"
//           ],
//           "Common Side Effects": [
//               "Drowsiness",
//               "Dizziness",
//               "Dry mouth",
//               "Blurred vision",
//               "Constipation"
//           ],
//           "Serious Side Effects": [
//               "Allergic reactions (rash, itching, swelling)",
//               "Irregular heartbeat",
//               "Seizures",
//               "Difficulty urinating"
//           ],
//           "Contraindications": [
//               "Hypersensitivity to dimenhydrinate or any component of the formulation",
//               "Children under 2 years of age"
//           ],
//           "Warnings & Precautions": [
//               "May cause drowsiness; use caution when driving or operating machinery",
//               "Avoid alcohol consumption",
//               "Use with caution in elderly patients",
//               "Consult a healthcare professional before use during pregnancy or breastfeeding",
//               "May worsen symptoms of glaucoma, asthma, or enlarged prostate"
//           ],
//           "Drug Interactions": [
//               "May increase the effects of other central nervous system depressants",
//               "May interfere with the effectiveness of some antibiotics",
//               "May increase the risk of side effects when used with certain antidepressants"
//           ],
//           "sources": [
//               "https://health-products.canada.ca/dpd-bdpp/",
//               "https://www2.gov.bc.ca/assets/gov/health/practitioner-pro/health-information-standards/bc-medication-data-dictionary-v13.pdf",
//               "https://dhpp.hpfb-dgpsa.ca/dhpp/resource/3944",
//               "https://www.canada.ca/en/health-canada/services/drugs-health-products/drug-products/drug-product-database.html",
//               "https://www.cihi.ca/sites/default/files/document/npduis_datadir_pub_en.pdf",
//               "https://canadian-pill-identifier.com/en/drug/gravol-tablets/3944",
//               "https://integbio.jp/dbcatalog/en/record/nbdc01789",
//               "https://www.drugshortagescanada.ca",
//               "https://hpr-rps.hres.ca",
//               "https://www.paab.ca/ask/question-707/"
//           ]
//       }
//         console.log(medInformation)
//         userInfo.savedMedications[i]["interactions"] = medInformation["Drug Interactions"];
//         userInfo.savedMedications[i]["sideEffects"] = [...medInformation["Common Side Effects"], ...medInformation["Serious Side Effects"]];
//         userInfo.savedMedications[i]["warnings"] = medInformation["Warnings & Precautions"];
//         userInfo.savedMedications[i]["sources"] = medInformation["sources"];
//       }
//       setSavedMedications(userInfo.savedMedications)
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//     }
//   };


//   useEffect(() => {
//     // Check for the authenticated user
//     const unsubscribe = auth.onAuthStateChanged((currentUser) => {
//       if (currentUser) {
//         setUserID(currentUser.uid);
//         retrieveMedications(currentUser.uid);
//       } else {
//         setUserID(null);  // user is logged out
//         navigate('/login');  // redirect to login for now
//       }
//     });
  
//     return () => unsubscribe(); // cleanup
//   }, [navigate]);


//   const handleDelete = (medicationDeleting) => {
//     // Confirmation dialog
//     const confirmed = window.confirm("Are you sure you want to delete this medication from your profile?");
//     if (!confirmed) return;

//     // update state to remove med using id (change if it's stored differently)
//     setSavedMedications((prev) => prev.filter((medication) => medication.id !== medicationDeleting.id));
//     deleteMedication(userID, medicationDeleting.endDate, medicationDeleting.frequency, medicationDeleting.frequencyUnit, medicationDeleting.startDate, medicationDeleting.dIN);
//     // api call to delete
//   };

//   if (loading) {
//     return <p>Loading your saved medications, this can take a minute...</p>;
//   }

//   if (savedMedications.length === 0) {
//     return <p>You have no saved medications.</p>;
//   }

//   return (
//     <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
//       <h1>Saved Medications</h1>
//       <br/>
//       <div>
//         {savedMedications.map((medication) => (
//           <div
//             key={medication.id}
//             style={{
//               border: '1px solid #99311c',
//               borderRadius: '5px',
//               padding: '15px',
//               marginBottom: '10px',
//             }}
//           >
//             <h2 style={{ margin: 0 }}>{medication.name}</h2>
//             <p><strong>Dosage:</strong> {medication.dosage}</p>
//             <p><strong>Interactions:</strong></p>
//             <ul>
//               {medication.interactions.map((interaction, index) => (
//                 <li key={index}>{interaction|| "Unknown"}</li>
//               ))}
//             </ul>
//             <p><strong>Side Effects:</strong></p>
//             <ul>
//               {medication.sideEffects.map((effect, index) => (
//                 <li key={index}>{effect|| "Unknown"}</li>
//               ))}
//             </ul>
//             <p><strong>Warnings:</strong></p>
//             <ul>
//               {medication.warnings.map((warning, index) => (
//                 <li key={index}>{warning|| "Unknown"}</li>
//               ))}
//             </ul>
//             <MedicationSources sources={medication.sources}/>
//             <button
//               onClick={() => handleDelete(medication)}
//               style={{
//                 backgroundColor: '#99311c',
//                 color: 'white',
//                 padding: '8px 15px',
//                 border: 'none',
//                 borderRadius: '5px',
//                 cursor: 'pointer',
//                 marginTop: '10px',
//               }}
//             >
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SavedMedications;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteMedication, retrieveUserInformation } from "./Firebase-Configurations/firestore.js";
import { auth } from './Firebase-Configurations/firebaseConfig';
import DPDClient from './backend/DPD_Axios.js';
import LNPHDClient from './backend/NPN_Axios.js';
import { FiChevronDown, FiChevronUp, FiTrash2, FiCalendar, FiBell } from 'react-icons/fi';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';

// Reuse the same color scheme
const colors = {
  primary: '#323824',
  secondary: '#99311c',
  background: '#f8f9fa',
  cardBackground: '#ffffff',
  text: '#333333',
  lightText: '#6c757d',
  border: '#e9ecef',
  hover: '#f1f3f5',
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: colors.background,
    minHeight: '100vh',
  },
  header: {
    color: colors.primary,
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '30px',
  },
  medicationCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    marginBottom: '20px',
    border: `1px solid ${colors.border}`,
  },
  medicationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  medicationTitle: {
    color: colors.text,
    fontSize: '20px',
    fontWeight: '600',
    margin: 0,
  },
  dosageText: {
    color: colors.text,
    fontSize: '16px',
    margin: '10px 0',
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: '16px',
    fontWeight: '600',
    margin: '15px 0 5px 0',
  },
  sectionHeader: {
    display: 'flex',
    //justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    marginBottom: '15px',
  },
  list: {
    paddingLeft: '20px',
    margin: '5px 0',
  },
  listItem: {
    marginBottom: '5px',
    color: colors.text,
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 15px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  deleteButton: {
    backgroundColor: colors.secondary,
    color: 'white',
    '&:hover': {
      backgroundColor: '#7a2618',
    },
    marginTop: '15px'
  },
  actionButton: {
    backgroundColor: colors.primary,
    color: 'white',
    '&:hover': {
      backgroundColor: '#3a5bbf',
    },
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: colors.lightText,
  },
  loadingText: {
    textAlign: 'center',
    padding: '40px',
    color: colors.text,
  },
  audioIcon: {
    color: colors.secondary,
    cursor: 'pointer',
    fontSize: '20px',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    padding: '10px 0px 0px 10px'
  },
};

const SavedMedications = () => {
  const [savedMedications, setSavedMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(null);
  const [expandedMedications, setExpandedMedications] = useState({});
  const navigate = useNavigate();

  const toggleMedication = (id) => {
    setExpandedMedications(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };


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

        //const medInformation = await retrieveMonograph(userInfo.savedMedications[i].dIN.slice(3), userInfo.savedMedications[i].dIN.slice(0, 3))
        const medInformation = {
          "Drug Name": "GRAVOL TABLETS",
          "Active Ingredient(s) & Strength": "Dimenhydrinate 50 MG",
          "Indications": [
              "Prevention and treatment of nausea and vomiting",
              "Motion sickness"
          ],
          "Common Side Effects": [
              "Drowsiness",
              "Dizziness",
              "Dry mouth",
              "Blurred vision",
              "Constipation"
          ],
          "Serious Side Effects": [
              "Allergic reactions (rash, itching, swelling)",
              "Irregular heartbeat",
              "Seizures",
              "Difficulty urinating"
          ],
          "Contraindications": [
              "Hypersensitivity to dimenhydrinate or any component of the formulation",
              "Children under 2 years of age"
          ],
          "Warnings & Precautions": [
              "May cause drowsiness; use caution when driving or operating machinery",
              "Avoid alcohol consumption",
              "Use with caution in elderly patients",
              "Consult a healthcare professional before use during pregnancy or breastfeeding",
              "May worsen symptoms of glaucoma, asthma, or enlarged prostate"
          ],
          "Drug Interactions": [
              "May increase the effects of other central nervous system depressants",
              "May interfere with the effectiveness of some antibiotics",
              "May increase the risk of side effects when used with certain antidepressants"
          ],
          "sources": [
              "https://health-products.canada.ca/dpd-bdpp/",
              "https://www2.gov.bc.ca/assets/gov/health/practitioner-pro/health-information-standards/bc-medication-data-dictionary-v13.pdf",
              "https://dhpp.hpfb-dgpsa.ca/dhpp/resource/3944",
              "https://www.canada.ca/en/health-canada/services/drugs-health-products/drug-products/drug-product-database.html",
              "https://www.cihi.ca/sites/default/files/document/npduis_datadir_pub_en.pdf",
              "https://canadian-pill-identifier.com/en/drug/gravol-tablets/3944",
              "https://integbio.jp/dbcatalog/en/record/nbdc01789",
              "https://www.drugshortagescanada.ca",
              "https://hpr-rps.hres.ca",
              "https://www.paab.ca/ask/question-707/"
          ]
      }
        console.log(medInformation)
        userInfo.savedMedications[i]["interactions"] = medInformation["Drug Interactions"];
        userInfo.savedMedications[i]["sideEffects"] = [...medInformation["Common Side Effects"], ...medInformation["Serious Side Effects"]];
        userInfo.savedMedications[i]["warnings"] = medInformation["Warnings & Precautions"];
        userInfo.savedMedications[i]["sources"] = medInformation["sources"];
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
    const confirmed = window.confirm("Are you sure you want to delete this medication from your profile?");
    if (!confirmed) return;

    setSavedMedications(prev => prev.filter(med => med.id !== medicationDeleting.id));
    deleteMedication(
      userID, 
      medicationDeleting.endDate, 
      medicationDeleting.frequency, 
      medicationDeleting.frequencyUnit, 
      medicationDeleting.startDate, 
      medicationDeleting.dIN
    );
  };


  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in this browser.');
    }
  };
  const speakSection = (sectionName, items) => {
    const text = `${sectionName}: ${items.join('. ')}`;
    speakText(text);
  };

  if (loading) {
    return <div style={styles.loadingText}>Loading your saved medications...</div>;
  }

  if (savedMedications.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>Saved Medications</h1>
        <div style={styles.emptyState}>
          <p>You haven't saved any medications yet.</p>
          <p>Scan or search for medications to save them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Saved Medications</h1>
      
      {savedMedications.map((medication) => (
        <div key={medication.id} style={styles.medicationCard}>
          <div 
            style={styles.medicationHeader}
            onClick={() => toggleMedication(medication.id)}
          >
            <h2 style={styles.medicationTitle}>
              {medication.name}
              <HiOutlineSpeakerWave 
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(`Medication: ${medication.name}`);
                }}
                style={styles.audioIcon}
              />
            </h2>
            {expandedMedications[medication.id] ? <FiChevronUp /> : <FiChevronDown />}
          </div>

          <p style={styles.dosageText}>
            <strong>Dosage:</strong> {medication.dosage}
            <HiOutlineSpeakerWave 
              onClick={(e) => {
                e.stopPropagation();
                speakText(`Dosage: ${medication.dosage}`);
              }}
              style={styles.audioIcon}
            />
          </p>

          {expandedMedications[medication.id] && (
            <div>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Interactions</h3>
                <HiOutlineSpeakerWave 
                  onClick={() => speakSection('Interactions', medication.interactions)}
                  style={styles.audioIcon}
                />
              </div>
              <ul style={styles.list}>
                {medication.interactions.map((interaction, index) => (
                  <li key={index} style={styles.listItem}>
                    {interaction || "Unknown"}
                  </li>
                ))}
              </ul>

              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Side Effects</h3>
                <HiOutlineSpeakerWave 
                  onClick={() => speakSection('Side Effects', medication.sideEffects)}
                  style={styles.audioIcon}
                />
              </div>
              <ul style={styles.list}>
                {medication.sideEffects.map((effect, index) => (
                  <li key={index} style={styles.listItem}>
                    {effect || "Unknown"}
                  </li>
                ))}
              </ul>

              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Warnings</h3>
                <HiOutlineSpeakerWave 
                  onClick={() => speakSection('Warnings', medication.warnings)}
                  style={styles.audioIcon}
                />
              </div>
              <ul style={styles.list}>
                {medication.warnings.map((warning, index) => (
                  <li key={index} style={styles.listItem}>
                    {warning || "Unknown"}
                  </li>
                ))}
              </ul>

              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Sources</h3>
                <HiOutlineSpeakerWave 
                  onClick={() => speakSection('Sources', medication.sources)}
                  style={styles.audioIcon}
                />
              </div>
              <ul style={styles.list}>
                {medication.sources.map((source, index) => (
                  <li key={index} style={styles.listItem}>
                    {source || "Unknown"}
                  </li>
                ))}
              </ul>

              <div style={styles.buttonGroup}>
                <button
                  onClick={() => handleDelete(medication)}
                  style={{ ...styles.button, ...styles.deleteButton }}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SavedMedications;