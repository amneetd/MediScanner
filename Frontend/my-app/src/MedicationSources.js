import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';



const MedicationSources = ({ sources }) => {
  const [totalShowing, setTotalShowing] = useState(4); 

  const setHideSources = () => {
    if(totalShowing === 4){
      setTotalShowing(sources.length)
    }
    else{
      setTotalShowing(4)
    }
  }

  return (
    <div>
            <p><strong>Sources:</strong></p>
            <ul>
              {sources.slice(0, totalShowing).map((source, index) => (
                <li key={index}><a href={source}>{source}</a></li>
              ))}
            </ul>        
            <button onClick={setHideSources}
        style={{
          backgroundColor: '#6b83ff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {(totalShowing === 4) ? "Show all sources" : "Show less sources"}
      </button>
    </div>
  );
};

export default MedicationSources;