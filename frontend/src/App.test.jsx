import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

// Mock heavy components
vi.mock('./pages/Home',    () => ({ default: () => <div>Home Page</div>  }));
vi.mock('./pages/Features', () => ({ default: () => <div>Features</div> }));

// Mock API calls
vi.mock('./services/api', () => ({
  default: {
    get:  vi.fn(),
    post: vi.fn(),
  },
  loginUser:    vi.fn(),
  registerUser: vi.fn(),
}));

import App from './App';
import { AuthProvider   } from './context/AuthContext';
import { UploadProvider } from './context/UploadContext';

// Helper — render with providers
const renderApp = (initialPath = '/') => {
  return render(
    <AuthProvider>
      <UploadProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <App />
        </MemoryRouter>
      </UploadProvider>
    </AuthProvider>
  );
};

describe('🚀 App Component Tests', () => {

  it('renders home page at root path', () => {
    renderApp('/');
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders login page at /login', () => {
    renderApp('/login');
    // Login page has "Sign In" text
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('renders 404 page for unknown route', () => {
    renderApp('/unknown-page-xyz');
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('redirects to login when accessing protected route without token', () => {
    // No token in localStorage
    localStorage.clear();
    renderApp('/doctor-dashboard');
    // Should redirect to login
    expect(screen.queryByText(/doctor dashboard/i)).not.toBeInTheDocument();
  });

});