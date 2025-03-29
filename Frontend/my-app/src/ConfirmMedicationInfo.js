import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './ConfirmMedicationInfo.css';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';


const ConfirmMedicationInfo = ({ startOn, endOn, frequency, handleConfirmation}) => {

  return (
    <div className='extract-wait-popup'>
        <div className='extract-wait-container' style={{borderRadius: '10px'}}>
            <p>Please confirm this is the correct information:</p>
            <p>Start Date: {startOn}</p>
            <p>End Date: {endOn} </p>
            <p>Frequency: {frequency}</p>
            <div className='button-row'>
                <button className="option-button" onClick={(e) => handleConfirmation("Yes")}>Yes</button>
                <button className="hide-button option-button">yes</button>
                <button className="option-button" onClick={(e) => handleConfirmation("No")}>No</button>
            </div>
        </div>
    </div>
  );
};

export default ConfirmMedicationInfo;