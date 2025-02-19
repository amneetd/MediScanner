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

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
          onClick={() => setSelectedDay(day)}
        >
          {day}
        </div>
      );
    }

    return daysArray;
  };

  const selectedDateMedications = () => {
    const startDate = new Date("2025-02-17T23:00:00");
    const endDate = new Date("2025-02-27T12:00:00");
    const viewingDate = new Date(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}T23:59:59`)
    const frequency = 50;
    if(startDate <= viewingDate && viewingDate <= endDate){
      if(((viewingDate - startDate) % (86400000 * (frequency / 24))) < 86400000){
        console.log("Medication name is taken today");
        const numberOfCycles = Math.floor((viewingDate - startDate) / (86400000 * (frequency / 24)));
        const medicationTime = new Date("2025-02-17T23:00:00");
        medicationTime.setHours(medicationTime.getHours() + numberOfCycles * frequency);
        console.log("Take medication at: ", medicationTime.getHours(), medicationTime.getMinutes(), medicationTime.getSeconds())
      }
      else{
        console.log("Medication name not taken on this day")
      }
    }
  }

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
        </div>
      )}
      <button onClick={selectedDateMedications}>activate selectedDateMedications function</button>
    </div>
  );
};

export default Calendar;
