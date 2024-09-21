// src/DropzoneComponent.js
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './index.css';
import { useNavigate } from 'react-router-dom'; 
import '@fortawesome/fontawesome-free/css/all.min.css';


const LoginPage = () => {
  const navigate = useNavigate();

  const nav = () => {
    navigate('/upload')
  }
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div className="mid-container">
      <header>
        <h1>MediScanner Login</h1>
      </header>
      <div className="login-box">
        <div className="login-back">
            <input type="text" id="username" name="username" placeholder="Enter username" />
            <input 
              type={showPassword ? 'text' : 'password'}  /* Toggle between password and text */
              name="password" 
            placeholder="Enter password" />
            <i 
              className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} eye-icon`} 
              onClick={togglePasswordVisibility}
            />
            <button type="submit" onClick={nav}>Login</button>
        </div>
        </div>
      <footer>
        <p>2024 MediScanner University of Calgary ENSF Capstone</p>
      </footer>
    </div>
  );
};

export default LoginPage;
