import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './index.css';
import { useNavigate } from 'react-router-dom'; 


const DropzoneComponent = ({ onDrop, images }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  console.log(images)

  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]; //Restricts to one file
    if (file) {
      setSelectedFile(file);
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

  const handleAcceptTerms = () => {
    setIsTermsAccepted(true);
    setShowTermsModal(false); 

    console.log('Uploading file:', selectedFile); //copied from handleUpload
    navigate('/medicalinfo'); 
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
