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

import React, { useState, useEffect, useCallback } from 'react';
import { FaCamera, FaUpload, FaSpinner } from 'react-icons/fa';
import { BsImage, BsLightning } from 'react-icons/bs';
import DropzoneComponent from './DropzoneComponent';
import { auth } from "./Firebase-Configurations/firebaseConfig.js";

const UploadPage = () => {
  const triggerUrl = 'http://10.13.184.123:5002/trigger';
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const colors = {
    primary: '#323824',
    secondary: '#99311c',
    background: '#f8f9fa', //ffddd9
    cardBackground: '#ffffff',
    text: '#333333',
    lightText: '#6c757d',
    border: '#e9ecef',
    hover: '#f1f3f5',
  };

  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      minHeight: '100vh',
      backgroundColor: colors.background,
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    title: {
      color: colors.primary,
      fontSize: '2.5rem',
      fontWeight: '600',
      marginBottom: '10px',
    },
    splitContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: '30px',
      justifyContent: 'center',
      alignItems: 'flex-start',
      '@media (max-width: 768px)': {
        flexDirection: 'column',
      },
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      flex: 1,
      border: `1px solid ${colors.border}`,
    },
    cardTitle: {
      color: colors.primary,
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    step: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
      padding: '15px',
      borderRadius: '8px',
      backgroundColor: colors.hover,
    },
    stepNumber: {
      backgroundColor: colors.primary,
      color: 'white',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: '15px',
      fontWeight: 'bold',
    },
    stepText: {
      color: colors.text,
      fontSize: '1rem',
    },
    uploadButton: {
      backgroundColor: colors.primary,
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginTop: '20px',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#3a5bbf',
      },
    },
    footer: {
      textAlign: 'center',
      marginTop: '40px',
      //color: colors.lightText,
      fontSize: '0.9rem',
    },
  };

  const handleGetPhotos = async () => {
    setIsLoading(true);
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
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>MediScanner</h1>
        <p style={{ color: colors.lightText }}>Upload your medication for instant identification</p>
      </header>

      <div style={styles.splitContainer}>
        {/* Instructions */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}> How to Guide: </h2>
          
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <div style={styles.stepText}>
              <strong>Take a clear photo</strong> of your medication bottle
            </div>
          </div>
          
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.stepText}>
              <strong>Upload</strong> your image 
            </div>
          </div>
          
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.stepText}>
              <strong>Get instant results</strong> for your medication information
            </div>
          </div>
        </div>

        {/* Upload */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}><FaUpload /> Upload Medication Image</h2>
          <DropzoneComponent onDrop={handleDrop} images={images} />
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ color: colors.lightText, marginBottom: '15px', marginLeft: '90px' }}>
              <small>Or use the medication scanner</small>
            </p>
            
            <button 
              onClick={handleGetPhotos} 
              style={styles.uploadButton}
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

      <footer style={styles.footer}>
        <p>© 2024-2025 MediScanner - University of Calgary ENSF Capstone Project</p>
      </footer>
    </div>
  );
};

export default UploadPage;