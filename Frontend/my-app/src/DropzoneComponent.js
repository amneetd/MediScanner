import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './index.css';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import ExtractDinPopup from './ExtractDinPopup';
import IssueExtractingPopup from './IssueExtractingPopup';


const DropzoneComponent = ({ onDrop }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [showWaitPopup, setShowWaitPopup] = useState(false);
  const [showIssueExtracting, setShowIssueExtracting] = useState(false);


  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]; //Restricts to one file
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function() {
          const data = reader.result;
          setSelectedFile(data);
      }
      //setSelectedFile(file);
      onDrop(file);
    }
  }, [onDrop]);

  const handleUpload = () => {
    if (selectedFile) {
      //console.log('Uploading file:', selectedFile);
      setShowTermsModal(true);
      //navigate('/medicalinfo');
    }
  };

  const handleAcceptTerms = async () => {
    setIsTermsAccepted(true);
    setShowTermsModal(false); 
    setShowWaitPopup(true)
    console.log('Uploading file:', selectedFile); //copied from handleUpload
    try{
      const medicationIdentifier = await axios
      .post("http://127.0.0.1:5001/mediscanner-1ffd7/us-central1/on_request_example", {
        "selectedFile" : selectedFile
      })
      console.log(medicationIdentifier)
      setShowWaitPopup(false)
      if(medicationIdentifier.data.slice(0,3) === "DIN" || medicationIdentifier.data.slice(0,3) === "NPN"){
        navigate('/medicalinfo', { state: medicationIdentifier.data });
      }
      else{
        console.log("can't identify DIN")
        setShowIssueExtracting(true);
      }
    }
    catch{
      setShowWaitPopup(false)
    }
    //navigate('/medicalinfo'); 
  };

  const handleRejectTerms = () => {
    setShowTermsModal(false); 
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop: handleDrop,
    maxFiles: 1,
    disabled: !!selectedFile 
  });

  const dropzoneClassName = `dropzone-${selectedFile ? 'active' : ''}`;

  return (
    <div 
      {...getRootProps()} 
      className={dropzoneClassName}
      style={{
        flexDirection: 'column'
      }}
    >
      <input {...getInputProps()} />
      {!selectedFile && (
        isDragActive ? 
        <p>Drop the file here...</p> :
        <p>Drag and drop your image here, or click to select files</p>
      )}

      {selectedFile && (
        <div className="file-info">
          <p>Selected File: 
            <br/>
            {selectedFile.name}</p>
        </div>
      )}

      {selectedFile && (
        <button className="upload-button" onClick={handleUpload}>
          Upload this file
        </button>
      )}

      {showIssueExtracting && <IssueExtractingPopup closePopup={setShowIssueExtracting} resestComponent={setSelectedFile}/>}

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
