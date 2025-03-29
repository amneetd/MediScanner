// // src/MedicalInfo.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveMedication } from "./Firebase-Configurations/firestore.js"
import { auth } from './Firebase-Configurations/firebaseConfig';
import ConfirmMedicationInfo from './ConfirmMedicationInfo.js';
import { useLocation } from "react-router-dom";
import DPDClient from './backend/DPD_Axios.js';
import LNPHDClient from './backend/NPN_Axios.js'
import { retrieveMonograph } from './Monograph.js';
import {FaVolumeUp} from 'react-icons/fa';
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { FiChevronDown, FiChevronUp, FiSave } from 'react-icons/fi';
import { BsCalendarDate, BsClock } from 'react-icons/bs';

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
  //const medicationIdentifier = location.state;
  const medicationIdentifier = "DIN00013803"
  const [totalShowing, setTotalShowing] = useState(4); 
  const [collapsedSections, setCollapsedSections] = useState({
    dosage: true,
    schedule: true,
    interactions: true,
    sideEffects: true,
    warnings: true,
    sources: true,
  });

  //for audio button
  const iconStyle = {
    color: '#99311c',
    cursor: 'pointer',
    marginLeft: '20px',
    fontSize: '23px',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'scale(1.1)',

    },
  };

  const setHideSources = () => {
    if(totalShowing === 4){
      setTotalShowing(medicationData.sources.length)
    }
    else{
      setTotalShowing(4)
    }
  }

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }

  const getMedication = async (medID) => {
    try {
      if(medID.slice(0, 3) === "DIN"){
        const client = new DPDClient();
        const med = await client.getAllInfo(medID.slice(3));
        //const medInformation = await retrieveMonograph(medID.slice(3), "DIN")
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
        med["interactions"] = medInformation["Drug Interactions"];
        med["sideEffects"] = [...medInformation["Common Side Effects"], ...medInformation["Serious Side Effects"]];
        med["warnings"] = medInformation["Warnings & Precautions"];
        med["sources"] = medInformation["sources"];
        setMedicationData(med);
        console.log(medInformation)
        setLoading(false);
      }
      else if(medID.slice(0, 3) === "NPN"){
        const client = new LNPHDClient();
        const med = await client.getAllInfo(medID.slice(3));
        const medInformation = await retrieveMonograph(medID.slice(3), "NPN")
        console.log(medInformation)
        med["interactions"] = medInformation["Drug Interactions"];
        med["sideEffects"] = [...medInformation["Common Side Effects"], ...medInformation["Serious Side Effects"]];
        med["warnings"] = medInformation["Warnings & Precautions"];
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


// return (
//   <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
//     {confirmInfoPopup && <ConfirmMedicationInfo 
//                             startOn={`${startDate} At ${startTime}`} 
//                             endOn={(takingIndefinitely) ? "Taking Indefinitely" : `${endDate} At ${endTime}`} 
//                             frequency={`${amountOfTime} ${selectedUnit}`} 
//                             handleConfirmation={handleConfirmSave}
//                           />}

//     <h1 style={{ color: '#333' }}>Medical Information</h1>
//     <br/>

//     {/* Medication Name Box */}
//     <div style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', padding: '20px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}>
//       <div style={{
//   display: 'flex',
//   //justifyContent: 'space-between'
// }}>
//       <h2>Medication Name</h2>
//       <HiOutlineSpeakerWave 

// onClick={() => speakText(`Medication Name: ${medicationData.productInfo[0].brand_name}`)}
// style={
//   iconStyle}
// />
// </div>
//       <div style={{flexDirection: 'row', display: 'flex'}}>
//         <p>{medicationData.productInfo[0].brand_name}</p>

//       </div>
//     </div>

//     {/* Dosage Box */}
//     <div style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', padding: '20px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}>
//       <div style={{display: 'flex'}}>
//         <h2 onClick={() => toggleSection('dosage')} style={{ cursor: 'pointer', color: '#212020', fontSize: '18px' }}>
//           {collapsedSections.dosage ? '+ Dosage' : '- Dosage'}
//         </h2>
//         <HiOutlineSpeakerWave onClick={() => speakText(`Dosage: ${`${ (medicationData.activeIngredients[0].dosage_unit === "") ? `${medicationData.activeIngredients[0].strength} ${medicationData.activeIngredients[0].strength_unit}` : `${medicationData.activeIngredients[0].dosage_unit} ${medicationData.activeIngredients[0].dosage_value}`}`} ${(userID) ? `every ${amountOfTime} ${selectedUnit}` : ""}`)}
//             style={iconStyle}/>
//       </div>
//       {!collapsedSections.dosage && (
//         <div style={{flexDirection: 'row', display: 'flex', }}>
//           <p>{`${ (medicationData.activeIngredients[0].dosage_unit === "") ? `${medicationData.activeIngredients[0].strength} ${medicationData.activeIngredients[0].strength_unit}` : `${medicationData.activeIngredients[0].dosage_unit} ${medicationData.activeIngredients[0].dosage_value}`}` + ` ${(userID) ? "every" : ""} `}</p>
//           {(userID) ? (
//             <div>
//               <input 
//                 onChange={e => setAmountOfTime(e.target.value)} 
//                 placeholder='12' 
//                 type='number'
//                 style={{
//                   height: '30px',
//                   width: '40px',
//                   fontSize: 16,
//                   //borderColor: '#99311c',
//                   borderWidth: '1px',
//                   borderRadius: '5px',
//                   margin: '8px 10px 0px 10px',
//                   //paddingTop: '5px'
//                 }}
//               />
//               <div style={{ position: "relative", display: "inline-block" }}>
//                 <button 
//                   onClick={() => setHideShowDropdown(!hideShowDropdown)}
//                   style={{
//                     height: '35px',
//                     width: '80px',
//                     backgroundColor: 'white',
//                     //borderColor: '#99311c',
//                     borderWidth: '1px',
//                     borderRadius: '5px',
//                     margin: '6px 0px 0px 0px'
//                   }}
//                 >
//                   {selectedUnit}
//                 </button>
//                 <div style={hideShowDropdown ? { display: 'none' } : { display: 'grid', position: 'absolute' }}>
//                   <button onClick={() => { setSelectedUnit("Hours"); setHideShowDropdown(!hideShowDropdown); }} style={{ height: '50px', width: '80px', backgroundColor: (selectedUnit === 'Hours') ? '#EAEAEA' : 'white', borderWidth: '0px 1px 0px 1px', borderRadius: '3px' }}>
//                     Hours
//                   </button>
//                   <button onClick={() => { setSelectedUnit("Days"); setHideShowDropdown(!hideShowDropdown); }} style={{ height: '50px', width: '80px', backgroundColor: (selectedUnit === 'Days') ? '#EAEAEA' : 'white', borderWidth: '0px 1px 0px 1px', borderRadius: '3px' }}>
//                     Days
//                   </button>
//                   <button onClick={() => { setSelectedUnit("Weeks"); setHideShowDropdown(!hideShowDropdown); }} style={{ height: '50px', width: '80px', backgroundColor: (selectedUnit === 'Weeks') ? '#EAEAEA' : 'white',  borderWidth: '0px 1px 1px 1px', borderRadius: '3px' }}>
//                     Weeks
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : ""}
//         </div>
//       )}
//     </div>
//     <div style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', padding: '20px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}>
//       <h2 onClick={() => toggleSection('schedule')} style={{ cursor: 'pointer', color: '#212020', fontSize: '18px' }}>
//         {collapsedSections.schedule ? '+ Schedule' : '- Schedule'}
//       </h2>

//       {!collapsedSections.schedule && (
//         <>
//        {userID && (
//         <div style={{ marginBottom: '20px' }}>
//          <h4>Start Taking On</h4>
//          <div style={{flexDirection: 'row', display: 'flex'}}>
//          <input type="date" onChange={e => setStartDate(e.target.value)}></input>
//          <input type="time" onChange={e => setStartTime(e.target.value)}
//         style={{
//           width: '100px',
//           marginLeft: '20px'
//         }}>
//         </input>
//         <HiOutlineSpeakerWave
//           onClick={() =>
//             speakText(`Start taking on ${startDate} at ${startTime}`)
//           }
//           style={iconStyle}
//         />
        
//         </div>
//       </div>
//       )}

//       {userID && (
//         <div style={{ marginBottom: '20px' }}>
//         <h4>Finish Taking On</h4>
//         <div style={{flexDirection: 'row', display: 'flex'}}>
//         <input type="date" onChange={e => setEndDate(e.target.value)} disabled={takingIndefinitely} value={endDate}></input>
//         <input type="time" onChange={e => setEndTime(e.target.value)} disabled={takingIndefinitely} value={endTime}
//         style={{
//           width: '100px',
//           marginLeft: '20px'
//         }}>
//         </input>
//         <HiOutlineSpeakerWave
//           onClick={() =>
//             speakText((takingIndefinitely) 
//             ? 
//             "No finish date. Taking for an indefinite amount of time" 
//             : 
//             `Finish taking on ${endDate} at ${endTime}`)
//           }
//           style={iconStyle}
//         />
          
//         </div>
//         <input type='checkbox' id='taking-indefinitely' onChange={e => {setTakingIndefinitely(e.target.checked); setEndDate(""); setEndTime("")}}
//           style={{
//             marginTop: '20px'
//           }}>
//         </input>
//         <label htmlFor='taking-indefinitely'>Taking Indefinitely</label>
//       </div>
//           )}</>
//         )}
// </div>
//     {/* Interactions Box */}
//     <div style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', padding: '20px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}>
//     <div style={{display: 'flex'}}>
//     <h2 onClick={() => toggleSection('interactions')} style={{ cursor: 'pointer', color: '#212020', fontSize: '18px' }}>
//         {collapsedSections.interactions ? '+ Interactions' : '- Interactions'}
//       </h2>
//         <HiOutlineSpeakerWave onClick={() => speakText(`Interactions: ${medicationData.interactions.join(', ')}`)}
//             style={iconStyle}/>
//       </div>
      

//       {!collapsedSections.interactions && (
//         <div style={{ flexDirection: 'row', display: 'flex' }}>
//           <ul>
//             {medicationData.interactions.map((interaction, index) => (
//               <li key={index}>{interaction}</li>
//             ))}
//           </ul>

//         </div>
//       )}
//     </div>

//     {/* Side Effects Box */}
//     <div style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', padding: '20px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}>
//     <div style={{display: 'flex'}}>
//     <h2 onClick={() => toggleSection('sideEffects')} style={{ cursor: 'pointer', color: '#212020', fontSize: '18px' }}>
//         {collapsedSections.sideEffects ? '+ Side Effects' : '- Side Effects'}
//       </h2>
//         <HiOutlineSpeakerWave onClick={() => speakText(`Side Effects: ${medicationData.sideEffects.join(', ')}`)}
//             style={iconStyle}/>
//       </div>
      

//       {!collapsedSections.sideEffects && (
//         <div style={{ flexDirection: 'row', display: 'flex' }}>
//           <ul>
//             {medicationData.sideEffects.map((effect, index) => (
//               <li key={index}>{effect}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>

//     {/* Warnings Box */}
//     <div style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', padding: '20px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}>
//     <div style={{display: 'flex'}}>
//       <h2 onClick={() => toggleSection('warnings')} style={{ cursor: 'pointer', color: '#212020', fontSize: '18px' }}>
//         {collapsedSections.warnings ? '+ Warnings' : '- Warnings'}
//       </h2>
//         <HiOutlineSpeakerWave onClick={() => speakText(`Warnings: ${medicationData.warnings.join(', ')}`)}
//             style={iconStyle}/>
//       </div>
      

//       {!collapsedSections.warnings && (
//         <div style={{ flexDirection: 'row', display: 'flex' }}>
//           <ul>
//             {medicationData.warnings.map((warning, index) => (
//               <li key={index}>{warning}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//     <div style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', padding: '20px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}>
//        <h2 onClick={() => toggleSection('sources')} style={{ cursor: 'pointer', color: '#212020', fontSize: '18px' }}>
//    {collapsedSections.sources ? '+ Sources' : '- Sources'}
//  </h2>

//          {!collapsedSections.sources && (<div>
//                    <div style={{flexDirection: 'row', display: 'flex'}}>
//          <ul>
//            {medicationData.sources.slice(0, totalShowing).map((source, index) => (
//             <li key={index}>{source}</li>
//           ))}
//         </ul>
//         </div>

//         <button 
//         onClick={setHideSources} 
//         style={{
//           backgroundColor: '#99311c',
//           color: 'white',
//           padding: '10px 20px',
//           border: 'none',
//           borderRadius: '7px',
//           cursor: 'pointer',
//         }}
//       >
//         {(totalShowing === 4) ? "Show all sources" : "Show less sources"}
//       </button>
//       </div>)}
//       </div>
//     <div style={{ marginTop: '20px' }}>
//       <button
//         onClick={handleSave}
//         style={{
//           backgroundColor: '#99311c',
//           color: 'white',
//           padding: '10px 20px',
//           border: 'none',
//           borderRadius: '7px',
//           cursor: 'pointer'
//         }}
//       >
//         Save Medication Information
//       </button>
//     </div>
//   </div>
// );
// };
// export default MedicalInfo;

//const MedicalInfo = () => {
  // ... (keep all your existing state and functions)

  // Modern color scheme
  //878540
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

  // Updated styles
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
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      marginBottom: '20px',
      border: `1px solid ${colors.border}`,
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      marginBottom: '15px',
    },
    sectionTitle: {
      color: colors.text,
      fontSize: '20px',
      fontWeight: '600',
      margin: 0,
    },
    contentText: {
      color: colors.text,
      fontSize: '16px',
      lineHeight: '1.6',
    },
    list: {
      paddingLeft: '20px',
      margin: '10px 0',
    },
    listItem: {
      marginBottom: '8px',
      color: colors.text,
    },
    inputGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: '10px 0',
    },
    input: {
      padding: '8px 12px',
      borderRadius: '6px',
      border: `1px solid ${colors.border}`,
      fontSize: '14px',
    },
    dropdown: {
      position: 'relative',
      display: 'inline-block',
    },
    dropdownButton: {
      padding: '8px 12px',
      borderRadius: '6px',
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.cardBackground,
      cursor: 'pointer',
      minWidth: '100px',
      textAlign: 'left',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dropdownMenu: {
      position: 'absolute',
      top: '100%',
      left: 0,
      zIndex: 1,
      backgroundColor: colors.cardBackground,
      border: `1px solid ${colors.border}`,
      borderRadius: '6px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      width: '100%',
    },
    dropdownItem: {
      padding: '8px 12px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: colors.hover,
      },
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      margin: '15px 0',
    },
    checkbox: {
      marginRight: '10px',
    },
    saveButton: {
      backgroundColor: colors.primary,
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#3a5bbf',
      },
    },
    audioIcon: {
      color: colors.primary,
      cursor: 'pointer',
      fontWeight: '900',
      fontSize: '20px',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.1)',
      },
    },
    sourcesButton: {
      backgroundColor: colors.secondary,
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      marginTop: '15px',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#7a2618',
      },
    },
  };

  // ... (keep all your existing useEffect and handler functions)

  return (
    <div style={styles.container}>
      {confirmInfoPopup && (
        <ConfirmMedicationInfo
          startOn={`${startDate} At ${startTime}`}
          endOn={takingIndefinitely ? "Taking Indefinitely" : `${endDate} At ${endTime}`}
          frequency={`${amountOfTime} ${selectedUnit}`}
          handleConfirmation={handleConfirmSave}
        />
      )}

      <h1 style={styles.header}>Medical Information</h1>

      {/* Medication Name Card */}
      <div style={styles.card}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Medication Name</h2>
          <HiOutlineSpeakerWave
            onClick={() => speakText(`Medication Name: ${medicationData.productInfo[0].brand_name}`)}
            style={styles.audioIcon}
          />
        </div>
        <p style={{ ...styles.contentText, fontSize: '18px', fontWeight: '500' }}>
          {medicationData.productInfo[0].brand_name}
        </p>
      </div>

      {/* Dosage Card */}
      <div style={styles.card}>
        <div style={styles.sectionHeader} onClick={() => toggleSection('dosage')}>
          <h2 style={styles.sectionTitle}>
            {collapsedSections.dosage ? (
              <>
                <FiChevronDown style={{ marginRight: '8px' }} />
                Dosage
              </>
            ) : (
              <>
                <FiChevronUp style={{ marginRight: '8px' }} />
                Dosage
              </>
            )}
          </h2>
          <HiOutlineSpeakerWave
            onClick={(e) => {
              e.stopPropagation();
              speakText(`Dosage: ${medicationData.activeIngredients[0].strength} ${medicationData.activeIngredients[0].strength_unit}`);
            }}
            style={styles.audioIcon}
          />
        </div>

        {!collapsedSections.dosage && (
          <div>
            <p style={styles.contentText}>
              {`${medicationData.activeIngredients[0].strength} ${medicationData.activeIngredients[0].strength_unit}`}
              {userID && ` every`}
            </p>

            {userID && (
              <div style={styles.inputGroup}>
                <input
                  onChange={(e) => setAmountOfTime(e.target.value)}
                  placeholder="12"
                  type="number"
                  style={styles.input}
                />
                
                <div style={styles.dropdown}>
                  <button
                    onClick={() => setHideShowDropdown(!hideShowDropdown)}
                    style={styles.dropdownButton}
                  >
                    {selectedUnit}
                    {hideShowDropdown ? <FiChevronDown /> : <FiChevronUp />}
                  </button>
                  
                  {!hideShowDropdown && (
                    <div style={styles.dropdownMenu}>
                      <div
                        onClick={() => {
                          setSelectedUnit("Hours");
                          setHideShowDropdown(true);
                        }}
                        style={styles.dropdownItem}
                      >
                        Hours
                      </div>
                      <div
                        onClick={() => {
                          setSelectedUnit("Days");
                          setHideShowDropdown(true);
                        }}
                        style={styles.dropdownItem}
                      >
                        Days
                      </div>
                      <div
                        onClick={() => {
                          setSelectedUnit("Weeks");
                          setHideShowDropdown(true);
                        }}
                        style={styles.dropdownItem}
                      >
                        Weeks
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Schedule Card */}
      <div style={styles.card}>
        <div style={styles.sectionHeader} onClick={() => toggleSection('schedule')}>
          <h2 style={styles.sectionTitle}>
            {collapsedSections.schedule ? (
              <>
                <FiChevronDown style={{ marginRight: '8px' }} />
                Schedule
              </>
            ) : (
              <>
                <FiChevronUp style={{ marginRight: '8px' }} />
                Schedule
              </>
            )}
          </h2>
        </div>

        {!collapsedSections.schedule && (
          <>
            {userID && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: colors.text, marginBottom: '10px' }}>
                  <BsCalendarDate style={{ marginRight: '8px' }} />
                  Start Taking On
                </h4>
                <div style={styles.inputGroup}>
                  <input
                    type="date"
                    onChange={(e) => setStartDate(e.target.value)}
                    style={styles.input}
                  />
                  <input
                    type="time"
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{ ...styles.input, width: '100px' }}
                  />
                  <HiOutlineSpeakerWave
                    onClick={() => speakText(`Start taking on ${startDate} at ${startTime}`)}
                    style={styles.audioIcon}
                  />
                </div>
              </div>
            )}

            {userID && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: colors.text, marginBottom: '10px' }}>
                  <BsCalendarDate style={{ marginRight: '8px' }} />
                  Finish Taking On
                </h4>
                <div style={styles.inputGroup}>
                  <input
                    type="date"
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={takingIndefinitely}
                    value={endDate}
                    style={styles.input}
                  />
                  <input
                    type="time"
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={takingIndefinitely}
                    value={endTime}
                    style={{ ...styles.input, width: '100px' }}
                  />
                  <HiOutlineSpeakerWave
                    onClick={() =>
                      speakText(
                        takingIndefinitely
                          ? "No finish date. Taking indefinitely"
                          : `Finish taking on ${endDate} at ${endTime}`
                      )
                    }
                    style={styles.audioIcon}
                  />
                </div>
                <div style={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="taking-indefinitely"
                    onChange={(e) => {
                      setTakingIndefinitely(e.target.checked);
                      setEndDate("");
                      setEndTime("");
                    }}
                    style={styles.checkbox}
                  />
                  <label htmlFor="taking-indefinitely" style={{ color: colors.text }}>
                    Taking Indefinitely
                  </label>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Interactions Card */}
      <div style={styles.card}>
        <div style={styles.sectionHeader} onClick={() => toggleSection('interactions')}>
          <h2 style={styles.sectionTitle}>
            {collapsedSections.interactions ? (
              <>
                <FiChevronDown style={{ marginRight: '8px' }} />
                Interactions
              </>
            ) : (
              <>
                <FiChevronUp style={{ marginRight: '8px' }} />
                Interactions
              </>
            )}
          </h2>
          <HiOutlineSpeakerWave
            onClick={(e) => {
              e.stopPropagation();
              speakText(`Interactions: ${medicationData.interactions.join(', ')}`);
            }}
            style={styles.audioIcon}
          />
        </div>

        {!collapsedSections.interactions && (
          <ul style={styles.list}>
            {medicationData.interactions.map((interaction, index) => (
              <li key={index} style={styles.listItem}>
                {interaction}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Side Effects Card */}
      <div style={styles.card}>
        <div style={styles.sectionHeader} onClick={() => toggleSection('sideEffects')}>
          <h2 style={styles.sectionTitle}>
            {collapsedSections.sideEffects ? (
              <>
                <FiChevronDown style={{ marginRight: '8px' }} />
                Side Effects
              </>
            ) : (
              <>
                <FiChevronUp style={{ marginRight: '8px' }} />
                Side Effects
              </>
            )}
          </h2>
          <HiOutlineSpeakerWave
            onClick={(e) => {
              e.stopPropagation();
              speakText(`Side Effects: ${medicationData.sideEffects.join(', ')}`);
            }}
            style={styles.audioIcon}
          />
        </div>

        {!collapsedSections.sideEffects && (
          <ul style={styles.list}>
            {medicationData.sideEffects.map((effect, index) => (
              <li key={index} style={styles.listItem}>
                {effect}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Warnings Card */}
      <div style={styles.card}>
        <div style={styles.sectionHeader} onClick={() => toggleSection('warnings')}>
          <h2 style={styles.sectionTitle}>
            {collapsedSections.warnings ? (
              <>
                <FiChevronDown style={{ marginRight: '8px' }} />
                Warnings
              </>
            ) : (
              <>
                <FiChevronUp style={{ marginRight: '8px' }} />
                Warnings
              </>
            )}
          </h2>
          <HiOutlineSpeakerWave
            onClick={(e) => {
              e.stopPropagation();
              speakText(`Warnings: ${medicationData.warnings.join(', ')}`);
            }}
            style={styles.audioIcon}
          />
        </div>

        {!collapsedSections.warnings && (
          <ul style={styles.list}>
            {medicationData.warnings.map((warning, index) => (
              <li key={index} style={styles.listItem}>
                {warning}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sources Card */}
      <div style={styles.card}>
        <div style={styles.sectionHeader} onClick={() => toggleSection('sources')}>
          <h2 style={styles.sectionTitle}>
            {collapsedSections.sources ? (
              <>
                <FiChevronDown style={{ marginRight: '8px' }} />
                Sources
              </>
            ) : (
              <>
                <FiChevronUp style={{ marginRight: '8px' }} />
                Sources
              </>
            )}
          </h2>
        </div>

        {!collapsedSections.sources && (
          <div>
            <ul style={styles.list}>
              {medicationData.sources.slice(0, totalShowing).map((source, index) => (
                <li key={index} style={styles.listItem}>
                  <a href={source} target="_blank" rel="noopener noreferrer" style={{ color: colors.primary }}>
                    {source}
                  </a>
                </li>
              ))}
            </ul>

            <button
              onClick={setHideSources}
              style={styles.sourcesButton}
            >
              {totalShowing === 4 ? "Show all sources" : "Show less sources"}
            </button>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <button
          onClick={handleSave}
          style={styles.saveButton}
        >
          <FiSave />
          Save Medication Information
        </button>
      </div>
    </div>
  );
};

export default MedicalInfo;