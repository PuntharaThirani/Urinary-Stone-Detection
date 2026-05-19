import React, { useState, useRef } from 'react';
import api from '../../services/api';

const FileUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading]  = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  // Validate file
  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG and PNG images are allowed';
    }
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  // Handle file selection
  const handleFile = (file) => {
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setMessage({ type: '', text: '' });
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  // Drag & Drop handlers
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true);  };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // Remove selected file
  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    setMessage({ type: '', text: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Upload file
  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select an image first' });
      return;
    }

    setIsUploading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      //  api instance use — token automatically attached
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage({
        type: 'success',
        text: 'Image uploaded successfully!',
      });

      if (typeof onUploadSuccess === 'function') {
        onUploadSuccess(response.data);
      }

    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Failed to upload image',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">

      {/*  Drop Zone  */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : selectedFile
            ? 'border-emerald-400 bg-emerald-50'
            : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileChange}
          className="hidden"
        />

        {selectedFile ? (
          /* Preview */
          <div className="w-full text-center">
            <img
              src={preview}
              alt="X-ray Preview"
              className="mx-auto max-h-[280px] max-w-full rounded-xl object-contain border border-slate-200"
            />
            <div className="mt-3 flex items-center justify-center gap-2">
              <p className="text-sm font-medium text-slate-600">
                {selectedFile.name}
              </p>
              <span className="text-xs text-slate-400">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove(); }}
              className="mt-2 text-xs font-medium text-red-500 hover:text-red-700 transition"
            >
              ✕ Remove
            </button>
          </div>
        ) : (
          
          /* Upload prompt */
          <div className="text-center">
            <div className="text-4xl mb-3">🏥</div>
            <p className="text-base font-bold text-slate-700">
              {isDragging ? 'Drop image here' : 'Upload X-Ray Image'}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Drag & drop or click to browse
            </p>
            <p className="mt-1 text-xs text-slate-400">
              JPG, PNG — Max 5MB
            </p>
          </div>
        )}
      </div>

      {/*  Message  */}
      {message.text && (
        <div className={`mt-3 rounded-2xl px-4 py-3 text-sm font-medium ${
          message.type === 'error'
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          {message.type === 'error' ? '⚠️' : '✅'} {message.text}
        </div>
      )}

      {/*  Upload Button  */}
      {selectedFile && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="mt-4 w-full rounded-2xl bg-blue-600 py-4 text-base font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Uploading...
            </span>
          ) : (
            '🚀 Upload Image'
          )}
        </button>
      )}
    </div>
  );
};

export default FileUpload;