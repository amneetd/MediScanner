import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './index.css';
import { useNavigate } from 'react-router-dom'; 


const DropzoneComponent = ({ onDrop }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();


  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]; //Restricts to one file
    if (file) {
      setSelectedFile(file);
      onDrop(file);
    }
  }, [onDrop]);

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile);

      navigate('/medicalinfo');
    }
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
    >
      <input {...getInputProps()} />
      {!selectedFile && (
        isDragActive ? 
        <p>Drop the file here...</p> :
        <p>Drag 'n' drop your image here, or click to select files</p>
      )}

      {selectedFile && (
        <div className="file-info">
          <p>Selected File: {selectedFile.name}</p>
        </div>
      )}

      {selectedFile && (
        <button className="upload-button" onClick={handleUpload}>
          Upload
        </button>
      )}
      
    </div>
  );
};

export default DropzoneComponent;
