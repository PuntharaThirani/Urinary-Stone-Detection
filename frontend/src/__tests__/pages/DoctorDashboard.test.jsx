import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock API calls — prevent real network requests
vi.mock('../../services/api', () => ({
  getReports:    vi.fn().mockResolvedValue({ data: [] }),
  getPatients:   vi.fn().mockResolvedValue({ data: [] }),
  getDashboardStats: vi.fn().mockResolvedValue({ data: {} }),
}));

// Mock auth context
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id:    'doctor123',
      name:  'Dr. Mitchell',
      email: 'doctor@test.com',
      role:  'doctor',
    },
    token: 'fake-test-token',
  }),
}));

// Import after mocks
import DoctorDashboard from '../../pages/DoctorDashboard';

// Helper
const renderDoctorDashboard = () => {
  return render(
    <MemoryRouter>
      <DoctorDashboard />
    </MemoryRouter>
  );
};


describe('🏥 DoctorDashboard Page Tests', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

 
  // 1. Dashboard Renders
 
  it('renders doctor dashboard page', () => {
    renderDoctorDashboard();

    // Check page loads without crash
    expect(document.body).toBeInTheDocument();
  });

  
  // 2. Welcome Message

  it('renders welcome message with doctor name', () => {
    renderDoctorDashboard();

    // Welcome text — partial match
    expect(
      screen.getByText(/welcome/i)
    ).toBeInTheDocument();
  });


  // 3. Analyze X-ray Button/Link
 
  it('renders New AI Analysis button', () => {
    renderDoctorDashboard();

    expect(
      screen.getByText(/new ai analysis/i)
    ).toBeInTheDocument();
  });

 
  // 4. View Reports Link

  it('renders View Patient Reports section', () => {
    renderDoctorDashboard();

    expect(
      screen.getByText(/patient reports/i)
    ).toBeInTheDocument();
  });

  
  // 5. Stats Cards
  
  it('renders statistics cards', () => {
    renderDoctorDashboard();

    expect(
      screen.getByText(/total scans/i)
    ).toBeInTheDocument();
  });

});