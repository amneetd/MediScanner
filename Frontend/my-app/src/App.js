// src/App.js
import React from "react";
import Calendar from "./Calendar";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from './UploadPage';
import Login from './Login';
import MedicalInfo from "./MedicalInfo";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/report" element={<MedicalInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
