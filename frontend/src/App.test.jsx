import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { UploadProvider } from './context/UploadContext';
import { describe, it, expect } from 'vitest';

describe('App Component', () => {
  it('renders login page text', () => {
    // App එක Providers ඇතුලේ ඔතලා (Wrap කරලා) Render කරනවා
    render(
      <AuthProvider>
        <UploadProvider>
          <App />
        </UploadProvider>
      </AuthProvider>
    );

    // Login Page එකේ "Login" හෝ "Join Us" වගේ වචනයක් තියෙනවද බලනවා
    // (Regular Expression /Login/i මගින් simple/capital භේදයකින් තොරව සොයයි)
    const loginText = screen.getAllByText(/Login/i)[0]; 
    expect(loginText).toBeInTheDocument();
  });
});