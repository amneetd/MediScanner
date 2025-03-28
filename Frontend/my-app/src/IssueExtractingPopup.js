import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './IssueExtractingPopup.css';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';


const IssueExtractingPopup = ({ closePopup, resestComponent }) => {

  return (
    <div className='issue-extracting-popup'>
        <div className='issue-extracting-container'>
            <p>Issue extracting medication identifier from photo. Please try a different angle or taking a more clear photo.</p>
            <button className='close-button' onClick={(e) => {closePopup(false); resestComponent(null);}}>Close</button>
        </div>
    </div>
  );
};

export default IssueExtractingPopup;