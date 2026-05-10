import React    from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './App.css'; // ✅ Main CSS

import { AuthProvider   } from './context/AuthContext';
import { UploadProvider } from './context/UploadContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <UploadProvider>
        <App />
      </UploadProvider>
    </AuthProvider>
  </React.StrictMode>
);