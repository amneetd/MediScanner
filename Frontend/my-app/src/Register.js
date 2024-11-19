// src/DropzoneComponent.js
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './index.css';
import { useNavigate } from 'react-router-dom'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom'
import 'react-phone-number-input/style.css'; 
import PhoneInput from 'react-phone-number-input';  





const Register = () => {
  const navigate = useNavigate();

  const nav = () => {
    navigate('/upload')
  }
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(''); 


  const register = () => {
    navigate('/register')
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };


  return (
    <div className="mid-container">
      <header>
        <h1>MediScanner Register</h1>
      </header>
      <div className="login-box">
        <div className="login-back2">
            <input type="text" name="username" placeholder="Create username" />
            <input type="text" name="email" placeholder="Email" />
            <PhoneInput
              international
              defaultCountry="US"
              value={phoneNumber}
              onChange={setPhoneNumber}
              placeholder="Enter phone number"
            />
            <input 
              type={showPassword ? 'text' : 'password'}  /* Toggle between password and text */
              name="password" 
            placeholder="Create password" />
            <i 
              className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} eye-icon`} 
              onClick={togglePasswordVisibility}
            />  
            <input 
              type={showPassword2 ? 'text' : 'password'}  /* Toggle between password and text */
              name="confirmPassword" 
              className="confirmPassword-Box"
            placeholder="Confirm password" />
            <i 
              className={`fas ${showPassword2 ? 'fa-eye-slash' : 'fa-eye'} eye-icon2`} 
              onClick={togglePasswordVisibility2}
            />  
          <button className="registerButton" type="submit" onClick={nav}>Register</button>
        </div>
        </div>
      <footer>
        <p>2024 MediScanner University of Calgary ENSF Capstone</p>
      </footer>
    </div>
  );
};

export default Register;
