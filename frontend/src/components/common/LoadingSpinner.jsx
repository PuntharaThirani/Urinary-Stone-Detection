import React from 'react';

const LoadingSpinner = () => {
  return (
    <div style={styles.overlay}>
      <div className="spinner"></div>
      <style>{`
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px', // අවශ්‍ය ප්‍රමාණයට වෙනස් කරගන්න
    width: '100%'
  }
};

export default LoadingSpinner;
