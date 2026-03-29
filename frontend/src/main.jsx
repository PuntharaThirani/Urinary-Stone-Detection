import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './assets/styles/theme.css';

import { AuthProvider } from './context/AuthContext';
import { UploadProvider } from './context/UploadContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <UploadProvider>
        <App />
      </UploadProvider>
    </AuthProvider>
  </React.StrictMode>
);