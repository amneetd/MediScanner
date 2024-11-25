// src/App.js
import React from "react";
import Calendar from "./Calendar";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from './UploadPage';
import Navbar from "./Navbar";
import NewNavbar from "./newNav";
import Login from './Login';
import MedicalInfo from "./MedicalInfo";
import SavedMedications from "./SavedMedications";
import Register from "./Register";
import UserProfile from "./Profile";
import Search from "./Search";
import Reminders from "./Reminders";

const App = () =>{
  return (
    <Router>
      <NewNavbar />
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/medicalinfo" element={<MedicalInfo />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/saved" element={<SavedMedications/>} />
          <Route path="/me" element={<UserProfile/>} />
          <Route path="/calendar" element={<Calendar/>} />
          <Route path="/search" element={<Search/>} />
          <Route path="/reminders" element={<Reminders/>} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
