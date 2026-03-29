import React from 'react';

const UploadProgress = ({ progress, message }) => {
  return (
    <div style={styles.container}>
      <div style={styles.textContainer}>
        <span>{message || 'Processing...'}</span>
        <span>{progress}%</span>
      </div>
      
      <div style={styles.progressBarBackground}>
        <div 
          style={{ 
            ...styles.progressBarFill, 
            width: `${progress}%` 
          }} 
        ></div>
      </div>
    </div>
  );
};

const styles = {
  container: { width: '100%', marginTop: '15px' },
  textContainer: { display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' },
  progressBarBackground: { width: '100%', height: '10px', backgroundColor: '#e0e0e0', borderRadius: '5px', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#007bff', transition: 'width 0.3s ease-in-out' }
};

export default UploadProgress;