import React, { useCallback } from 'react';
import './index.css';
import DropzoneComponent from './DropzoneComponent';
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./Firebase-Configurations/firebaseConfig.js"

const UploadPage = () => {
  //RaspberryPi IP address
  const triggerUrl = 'http://10.13.66.50:5002/trigger';

  const handleGetPhotos = async () => {
    try {
      const response = await fetch(triggerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Server response:', data);
      // You can display a message to the user or update the UI based on the response.
    } catch (error) {
      console.error('Error triggering photos:', error);
    }
  };

    const handleDrop = useCallback((acceptedFiles) => {
        // Handle the uploaded files
        console.log(acceptedFiles);
      }, []);

      onAuthStateChanged(auth, activeUser => {
        if(activeUser){
          console.log("login is a success");
        }
        else{
          console.log("user has logged out");
        }
      })

  return (
    <div className="mid-container">
      <header>
        <h1>MediScanner</h1>
      </header>
      <div className="split-sections">
        <div className="left-section">
          <h2>It's Simple!</h2>
          <p>1. Take a photo of your medication</p>
          <p>2. Drag and upload it</p>
          <p>3. Wait for results</p>
        </div>
        <div className="right-section">
          <h2>Upload Your Image</h2>
          <DropzoneComponent onDrop={handleDrop} />
          <button onClick={handleGetPhotos}>Scan Photos</button>
        </div>
      </div>
      <footer>
        <p>2024 MediScanner University of Calgary ENSF Capstone</p>
      </footer>
    </div>
  );
};

export default UploadPage;
