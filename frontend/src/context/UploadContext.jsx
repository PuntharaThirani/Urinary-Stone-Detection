import React, { createContext, useState } from 'react';
import uploadService from '../services/uploadService';

export const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // පින්තූරයක් තෝරාගැනීම
  const selectFile = (selectedFile) => {
    setFile(selectedFile);
    setError(null);
    setResult(null);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  // AI එකට යැවීම
  const analyzeImage = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const data = await uploadService.predictStone(file);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message || "Analysis Failed");
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // සියල්ල Reset කිරීම (New Analysis)
  const resetUpload = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <UploadContext.Provider 
      value={{ 
        file, 
        previewUrl, 
        result, 
        isAnalyzing, 
        error, 
        selectFile, 
        analyzeImage, 
        resetUpload 
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};