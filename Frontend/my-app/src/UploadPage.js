import './index.css';
import DropzoneComponent from './DropzoneComponent';
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./Firebase-Configurations/firebaseConfig.js"
import React, { useState, useCallback, useEffect } from 'react';


const UploadPage = () => {
  // Raspberry Pi trigger URL (make sure the IP/port is correct)
  const triggerUrl = 'http://10.13.184.123:5002/trigger';
  const [images, setImages] = useState([]);

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
      if (data.status === 'success' && Array.isArray(data.images)) {
        // Save the image URL array as the state variable "images"
        setImages(data.images);
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error triggering photos:', error);
    }
  };

  useEffect(()=> {
    console.log(images)
  }, [images]);

  const handleDrop = useCallback((acceptedFiles) => {
    // Handle the uploaded files if needed.
    console.log(acceptedFiles);
  }, []);

  // Render the photos if available.
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
          <DropzoneComponent onDrop={handleDrop} images={images} />
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