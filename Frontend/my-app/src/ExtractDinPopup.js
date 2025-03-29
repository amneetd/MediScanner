import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './ExtractDinPopup.css';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';


const ExtractDinPopup = () => {

  return (
    <div className='extract-wait-popup'>
        <div className='extract-wait-container' style={{borderRadius: '10px'}}>
            <p>Please wait while your medication is identified. This can take a minute.</p>
        </div>
    </div>
  );
};

export default ExtractDinPopup;