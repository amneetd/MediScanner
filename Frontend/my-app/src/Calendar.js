/**
 * to edit:
 * - a user should be able to edit reminders here
 * - a user should be able to remove an item from the calendar (either a one-time thing or for every instance)
 */

import React, { useState, useEffect } from "react";
import { retrieveUserInformation } from "./Firebase-Configurations/firestore.js"
import { auth } from './Firebase-Configurations/firebaseConfig';
import "./Calendar.css";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null); // To store the selected day
  const [userID, setUserID] = useState(null);  
  const [savedMedications, setSavedMedications] = useState([]);
  const [currentDateMedications, setCurrentDateMedications] = useState([]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const frequencyUnitConversion = {"Hours" : 1, "Days" : 24, "Weeks" : 168}

  const retrieveMedications = async (id) => {
    try {
      const userInfo = await retrieveUserInformation(id)
      setSavedMedications(userInfo.savedMedications)
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUserID(currentUser.uid)
        retrieveMedications(currentUser.uid);
      } 
    });
  }, []);

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

  const selectedDateMedications = (newDay) => {
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
          while(medicationTime.getDate() === viewingDate.getDate() && startDate <= medicationTime){
            if(medicationTime <= endDate){
              todaysMedications.push({medTime: new Date(medicationTime.getTime()), medName: med.dIN})
            }
            medicationTime.setTime(medicationTime.getTime() - (86400000 * (frequency / 24)));
          }
        }
        else{
          console.log("Medication name not taken on this day")
        }
      }
    }
    setCurrentDateMedications(todaysMedications.sort((med1, med2) => med1.medTime - med2.medTime))
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
          {<div className="medication-times-box">{currentDateMedications.map((medication, index)=> <div key={index}>{medication.medName} {((medication.medTime.getHours() % 12) === 0) ? "12" : (medication.medTime.getHours() % 12)}:{String(medication.medTime.getMinutes()).padStart(2, "0")} {(medication.medTime.getHours() < 12) ? "AM" : "PM"}</div>)}</div>}
        </div>
      )}
    </div>
  );
};

export default Calendar;
