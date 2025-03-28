import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './index.css';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import ExtractDinPopup from './ExtractDinPopup';
import IssueExtractingPopup from './IssueExtractingPopup';
import { ImageContext } from './UploadPage';


const DropzoneComponent = ({images = []}) => {
  const [selectedFile, setSelectedFile] = useState([]);
  const navigate = useNavigate();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [showWaitPopup, setShowWaitPopup] = useState(false);
  const [showIssueExtracting, setShowIssueExtracting] = useState(false);

  console.log('testing dropzone component')
  console.log(images)
  console.log("image 1", images[0])

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedFile(prevFiles => [...prevFiles, ...images]);
    }
  }, [images]);

  console.log("selected file", selectedFile)
  console.log(selectedFile.length)
  
  const handleDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0&& acceptedFiles[0].name) {
      setSelectedFile(acceptedFiles); // Set array of files
    }
  }, []);

  

  const handleUpload = () => {
    if (selectedFile.length>0) {
      //console.log('Uploading file:', selectedFile);
      setShowTermsModal(true);
      //navigate('/medicalinfo');
    }
  };

  const handleAcceptTerms = async () => {
    setIsTermsAccepted(true);
    setShowTermsModal(false);
    setShowWaitPopup(true);
  
    try {
      const formData = new FormData();
      selectedFile.forEach((file, index) => {
        formData.append('file', file);
      });

      console.log([...formData.entries()]);

  
      const response = await axios.post(
        "https://ocr-api-768763807243.us-central1.run.app/ocr/",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log("Backend Response:", response);
      setShowWaitPopup(false);
      const result = response.data.code 
      if (result.startsWith("DIN") || result.startsWith("NPN")) {
        navigate('/medicalinfo', { state: response.data });
      } else {
        setShowIssueExtracting(true);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setShowWaitPopup(false);
      setShowIssueExtracting(true);
    }
  };

  const handleRejectTerms = () => {
    setShowTermsModal(false); 
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop: handleDrop,
    maxFiles: 10,
    disabled: selectedFile.length > 0,
    multiple: true
  });

  const dropzoneClassName = `dropzone-${selectedFile.length>0 ? 'active' : ''}`;

  return (
    <div 
      {...getRootProps()} 
      className={dropzoneClassName}
      style={{
        flexDirection: 'column'
      }}
    >
      <input {...getInputProps()} />
      {((selectedFile.length === 0) || (selectedFile.length === undefined)) && (
        isDragActive ? 
        <p>Drop the file here...</p> :
        <p>Drag and drop your image here, or click to select files</p>
      )}

      {selectedFile.length>0 && (
        <div className="file-info">
          <p>Selected File: 
            <br/>
            {selectedFile.length > 0 && selectedFile[0].name}</p>
        </div>
      )}

      {selectedFile.length>0 && (
        <button className="upload-button" onClick={handleUpload}>
          Upload this file
        </button>
      )}

      {showIssueExtracting && <IssueExtractingPopup closePopup={setShowIssueExtracting} resestComponent={() => setSelectedFile([])}/>}

      {showWaitPopup && <ExtractDinPopup />}

        {showTermsModal && (
        <div className="terms-modal">
          <div className="terms-content">
            <h2>Terms and Conditions</h2>
            <p>
              By using this app, you agree to our terms and conditions...

              <p>
              Medication Scans: This app allows you to scan photos of your medications. The app processes these images to provide relevant information. This data is anonymized, and no personally identifiable information is stored by default.
<br/><br/>
Personal Information: The app does not store any personal information unless you request it (e.g. for saving medication history or reminders). If you choose to provide personal data, it will be securely stored and used only for the specific purposes you request.
<br/><br/>
Anonymization: All data collected, including scanned images, is anonymized to protect your privacy. We do not link the data to your identity without your explicit consent.
<br/><br/>User Consent: By using the app, you consent to the processing of your data as described in this agreement.
If you choose to provide personal information (e.g. saving data, creating an account), you consent to its collection, storage, and use for the purposes you have requested.
              </p>
            </p>
            <div className="modal-buttons">
              <button onClick={handleAcceptTerms}>Accept</button>
              <button onClick={handleRejectTerms}>Reject</button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default DropzoneComponent;