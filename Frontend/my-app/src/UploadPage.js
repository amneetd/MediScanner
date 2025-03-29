// import './index.css';
// import DropzoneComponent from './DropzoneComponent';
// import { onAuthStateChanged } from "firebase/auth";
// import { db, auth } from "./Firebase-Configurations/firebaseConfig.js"
// import React, { useState, useCallback, useEffect } from 'react';


// const UploadPage = () => {
//   // Raspberry Pi trigger URL (make sure the IP/port is correct)
//   const triggerUrl = 'http://10.13.184.123:5002/trigger';
//   const [images, setImages] = useState([]);

//   const handleGetPhotos = async () => {
//     try {
//       const response = await fetch(triggerUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//       const data = await response.json();
//       console.log('Server response:', data);
//       if (data.status === 'success' && Array.isArray(data.images)) {
//         // Save the image URL array as the state variable "images"
//         setImages(data.images);
//       } else {
//         console.error('Error:', data.message);
//       }
//     } catch (error) {
//       console.error('Error triggering photos:', error);
//     }
//   };

//   useEffect(()=> {
//     console.log(images)
//   }, [images]);

//   const handleDrop = useCallback((acceptedFiles) => {
//     // Handle the uploaded files if needed.
//     console.log(acceptedFiles);
//   }, []);

//   // Render the photos if available.
//   return (
//     <div className="mid-container">
//       <header>
//         <h1>MediScanner</h1>
//       </header>
//       <div className="split-sections">
//         <div className="left-section">
//           <h2>It's Simple!</h2>
//           <p>1. Take a photo of your medication</p>
//           <p>2. Drag and upload it</p>
//           <p>3. Wait for results</p>
//         </div>
//         <div className="right-section">
//           <h2>Upload Your Image</h2>
//           <DropzoneComponent onDrop={handleDrop} images={images} />
//           <button onClick={handleGetPhotos}>Scan Photos</button>
//         </div>
//       </div>
//       <footer>
//         <p>2024-2025 MediScanner University of Calgary ENSF Capstone</p>
//       </footer>
//     </div>
//   );
// };

// export default UploadPage;

import React, { useState, useCallback } from 'react';
import { FaCamera, FaUpload, FaSpinner } from 'react-icons/fa';
import { BsImage, BsLightning } from 'react-icons/bs';
import DropzoneComponent from './DropzoneComponent';
import './UploadPage.css'; // Import the CSS file

const UploadPage = () => {
  const triggerUrl = 'http://10.13.184.123:5002/trigger';
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetPhotos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(triggerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Server response:', data);
      if (data.status === 'success' && Array.isArray(data.images)) {
        setImages(data.images);
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error triggering photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);

  return (
    <div className="container">
      <header className="header" style={{display: 'flex', flexDirection: 'column'}}>
        <h1 className="title">MediScanner</h1>
        <p style={{ color: '#6c757d' }}>Upload your medication for instant identification</p>
      </header>

      <div className="splitContainer">
        {/* Instructions */}
        <div className="card">
          <h2 className="cardTitle"> How to Guide: </h2>

          <div className="step">
            <div className="stepNumber">1</div>
            <div className="stepText">
              <strong>Take a clear photo</strong> of your medication bottle
            </div>
          </div>

          <div className="step">
            <div className="stepNumber">2</div>
            <div className="stepText">
              <strong>Upload</strong> your image
            </div>
          </div>

          <div className="step">
            <div className="stepNumber">3</div>
            <div className="stepText">
              <strong>Get instant results</strong> for your medication information
            </div>
          </div>
        </div>

        {/* Upload */}
        <div className="card">
          <h2 className="cardTitle">
            <FaUpload /> Upload Medication Image
          </h2>
          <DropzoneComponent onDrop={handleDrop} images={images} />

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ color: '#6c757d', marginBottom: '15px',  }}>
              <small>Or use the medication scanner</small>
            </p>

            <button
              onClick={handleGetPhotos}
              className="uploadButton"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <FaCamera />
                  Scan Photos Automatically
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>© 2024-2025 MediScanner - University of Calgary ENSF Capstone Project</p>
      </footer>
    </div>
  );
};

export default UploadPage;
