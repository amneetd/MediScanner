// src/DropzoneComponent.js
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './index.css';
import { useNavigate } from 'react-router-dom'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import { collection, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "./Firebase-Configurations/firebaseConfig.js"

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const updateUsername = (e) => {
    setUsername(e.target.value);
  }

  const updatePassword = (e) => {
    setPassword(e.target.value);
  }

  const nav = () => {
    console.log(username, password);
    signInWithEmailAndPassword(auth, username, password).then((userCredential) => {
      console.log("signed in successfully");
      const activeUser = userCredential.user;
      navigate('/upload')
    }).catch((error) => {
      window.alert("trouble logging in");
      console.log(error);
    })
    navigate('/upload')
  }

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
            <input type="text" id="username" name="username" placeholder="Enter username" onChange={updateUsername}/>
            <input 
              type={showPassword ? 'text' : 'password'}  /* Toggle between password and text */
              name="password" 
              placeholder="Enter password" 
              onChange={updatePassword}/>
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
