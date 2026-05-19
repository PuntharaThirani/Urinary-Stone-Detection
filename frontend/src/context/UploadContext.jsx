import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

// Create context
export const UploadContext = createContext();

// Custom hook 
export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within UploadProvider');
  }
  return context;
};

export const UploadProvider = ({ children }) => {
  const [file, setFile]  = useState(null);
  const [previewUrl, setPreviewUrl]  = useState(null);
  const [uploadedPath, setUploadedPath] = useState(null);
  const [result, setResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  // Select file — create preview
  const selectFile = (selectedFile) => {
    setFile(selectedFile);
    setError(null);
    setResult(null);
    setUploadedPath(null);

    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  // Step 1 — Upload image to server
  const uploadImage = async () => {
    if (!file) return null;

    setIsUploading(true);
    setProgress(20);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const filePath = response.data.image?.filePath;
      setUploadedPath(filePath);
      setProgress(50);
      return filePath;

    } catch (err) {
      const msg = err?.response?.data?.message || 'Upload failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  // Step 2 — Run AI analysis
  const analyzeImage = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setProgress(60);
    setError(null);

    try {
      // Upload first if not done
      let imagePath = uploadedPath;
      if (!imagePath) {
        imagePath = await uploadImage();
      }

      setProgress(75);

      // Run prediction
      const response = await api.post('/predict', { imagePath });

      setProgress(100);
      setResult(response.data);
      return response.data;

    } catch (err) {
      const msg = err?.response?.data?.message || 'Analysis failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset everything
  const resetUpload = () => {
    setFile(null);
    setPreviewUrl(null);
    setUploadedPath(null);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <UploadContext.Provider value={{
      file,
      previewUrl,
      uploadedPath,
      result,
      isUploading,
      isAnalyzing,
      error,
      progress,
      selectFile,
      uploadImage,
      analyzeImage,
      resetUpload,
    }}>
      {children}
    </UploadContext.Provider>
  );
};