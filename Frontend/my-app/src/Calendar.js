/**
 * to edit:
 * - a user should be able to edit reminders here
 * - a user should be able to remove an item from the calendar (either a one-time thing or for every instance)
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { retrieveUserInformation } from "./Firebase-Configurations/firestore.js"
import { auth } from './Firebase-Configurations/firebaseConfig';
import "./Calendar.css";
import DPDClient from './backend/DPD_Axios.js';
import LNPHDClient from './backend/NPN_Axios.js'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null); // To store the selected day
  const [userID, setUserID] = useState(null);  
  const [savedMedications, setSavedMedications] = useState([]);
  const [currentDateMedications, setCurrentDateMedications] = useState([]);
  const [medicationCache, setMedicaionCache] = useState([]);
  const [showLoadingSchedule, setShowLoadingSchedule] = useState(true); 
  const navigate = useNavigate();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const frequencyUnitConversion = {"Hours" : 1, "Days" : 24, "Weeks" : 168}


  const getMedication = async (medID) => {
    try {
      if(medID.slice(0, 3) === "DIN"){
        const client = new DPDClient();
        const med = await client.getAllInfo(medID.slice(3));
        let temp = {};
        temp["identifier"] = med.productInfo[0].drug_identification_number;
        temp["medName"] = med.productInfo[0].brand_name;
        console.log(med)
        console.log(temp)
        return temp;
      }
      else if(medID.slice(0, 3) === "NPN"){
        const client = new LNPHDClient();
        const med = await client.getAllInfo(medID.slice(3));
        let temp = {};
        temp["identifier"] = med.productInfo[0].drug_identification_number;
        temp["medName"] = med.productInfo[0].brand_name;
        console.log(med)
        console.log(temp)
        return temp;
      }
    } catch (err) {
      console.error(err);
    }
  };


  const retrieveMedications = async (id) => {
    try {
      const userInfo = await retrieveUserInformation(id)
      setSavedMedications(userInfo.savedMedications)
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


  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (increment) => {
    let newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + increment,
      1
    );
    setCurrentDate(newDate);
    setSelectedDay(null); // Clear the selected day when changing the month
  };

  const selectedDateMedications = async (newDay) => {
    setShowLoadingSchedule(true);
    setSelectedDay(newDay);
    var todaysMedications = []
    for(const med of savedMedications){
      const startDate = new Date(med.startDate);
      const viewingDate = new Date(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(newDay).padStart(2, "0")}T23:59:59`)
      const startOfViewingDate = new Date(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(newDay).padStart(2, "0")}T00:00:00`)
      const endDate = new Date((med.endDate === "indefinitely") ? (viewingDate.getTime() + 1000) : med.endDate);
      const frequency = med.frequency * frequencyUnitConversion[med.frequencyUnit];
      if(startDate <= viewingDate && startOfViewingDate <= endDate){
        if(((viewingDate - startDate) % (86400000 * (frequency / 24))) < 86400000){
          const numberOfCycles = Math.floor((viewingDate - startDate) / (86400000 * (frequency / 24)));
          const medicationTime = new Date(med.startDate);
          medicationTime.setTime(medicationTime.getTime() + 86400000 * (numberOfCycles / (24 / frequency)));
          let cachedMedications = medicationCache;
          while(medicationTime.getDate() === viewingDate.getDate() && startDate <= medicationTime){
            if(medicationTime <= endDate){
              let i = cachedMedications.findIndex(item => item.identifier === med.dIN.slice(3));
              if(-1 < i){
                todaysMedications.push({medTime: new Date(medicationTime.getTime()), medName: cachedMedications[i].medName})
              }
              else{
                const medCaching = await getMedication(med.dIN);
                todaysMedications.push({medTime: new Date(medicationTime.getTime()), medName: medCaching.medName})
                cachedMedications.push(medCaching);
              }
              //todaysMedications.push({medTime: new Date(medicationTime.getTime()), medName: med.dIN})
            }
            medicationTime.setTime(medicationTime.getTime() - (86400000 * (frequency / 24)));
          }
          setMedicaionCache(cachedMedications);
        }
        else{
          console.log("Medication name not taken on this day")
        }
      }
    }
    setCurrentDateMedications(todaysMedications.sort((med1, med2) => med1.medTime - med2.medTime))
    setShowLoadingSchedule(false);
  }

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const daysInMonth = getDaysInMonth(year, month);

    const daysArray = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<div key={`empty-${i}`} className="empty-day"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(
        <div
          key={day}
          className={`calendar-day ${selectedDay === day ? "selected" : ""}`}
          onClick={() => {selectedDateMedications(day)}}
        >
          {day}
        </div>
      );
    }

    return daysArray;
  };


  return (
    <div className="calendar-container">
      <div className="calendar">
        <div className="header">
          <button onClick={() => changeMonth(-1)}>{"<"}</button>
          <div>
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
          </div>
          <button onClick={() => changeMonth(1)}>{">"}</button>
        </div>
        <div className="days-of-week">
          {daysOfWeek.map((day) => (
            <div key={day} className="day-of-week">
              {day}
            </div>
          ))}
        </div>
        <div className="days">{renderDays()}</div>
      </div>
      <br/>
      {selectedDay && (
        <div className="info-box">
          <h2>{`${currentDate.toLocaleString("default", { month: "long" })} ${
              selectedDay
            }, ${currentDate.getFullYear()}`} Medication Information</h2>
          <p>Details here: </p>
          {(showLoadingSchedule) ? 
            <p>Loading medication schedule.</p>
            : 
            <div className="medication-times-box">{currentDateMedications.map((medication, index)=> <div key={index}>{medication.medName}: {((medication.medTime.getHours() % 12) === 0) ? "12" : (medication.medTime.getHours() % 12)}:{String(medication.medTime.getMinutes()).padStart(2, "0")} {(medication.medTime.getHours() < 12) ? "AM" : "PM"}</div>)}</div>}
        </div>
      )}
    </div>
  );
};

export default Calendar;
