import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file)); 
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage('Please select an image first!');
            return;
        }

        setIsUploading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('image', selectedFile); 

        try {
            // 🚀 වෙනස මෙතනයි: headers කෑල්ල අයින් කරලා තියෙන්නේ
            const response = await axios.post('http://localhost:5000/api/upload', formData);

            setMessage('✅ Image uploaded successfully!');
            console.log("Upload Response (from Backend):", response.data);

            // 🚀 AnalyzeXrayPage එකට ඩේටා යවන තැන
            if (typeof onUploadSuccess === 'function') {
                onUploadSuccess(response.data);
                console.log("✅ Data passed to parent page successfully!");
            } else {
                console.error("❌ ERROR: onUploadSuccess is not passed properly from the parent component!");
            }

        } catch (error) {
            console.error("Upload Error:", error);
            setMessage('❌ Failed to upload the image.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '10px', maxWidth: '400px', margin: '20px auto', backgroundColor: '#f9f9f9', textAlign: 'center' }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Upload X-Ray Image</h3>
            
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ marginBottom: '15px', display: 'block', margin: '0 auto' }}
            />

            {preview && (
                <div style={{ margin: '15px 0' }}>
                    <img src={preview} alt="X-ray Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid #ccc' }} />
                </div>
            )}

            <button 
                onClick={handleUpload} 
                disabled={isUploading || !selectedFile}
                style={{ 
                    padding: '12px 20px', 
                    backgroundColor: isUploading ? '#bdc3c7' : '#2980b9', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px',
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    width: '100%',
                    fontSize: '16px',
                    fontWeight: 'bold'
                }}
            >
                {isUploading ? 'Uploading... ⏳' : 'Upload Image 🚀'}
            </button>

            {message && (
                <p style={{ marginTop: '15px', fontWeight: 'bold', color: message.includes('✅') ? '#27ae60' : '#c0392b' }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default FileUpload;