import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DoctorDashboard from '../../pages/DoctorDashboard';
import { describe, it, expect } from 'vitest';

describe('DoctorDashboard Page', () => {
  
  it('renders welcome message', () => {
    render(
      <BrowserRouter>
        <DoctorDashboard />
      </BrowserRouter>
    );

    // "Doctor Dashboard" කියන වචනේ තියෙනවද බලනවා
    expect(screen.getByText(/Doctor Dashboard/i)).toBeInTheDocument();
  });

  it('renders analyze button/card', () => {
    render(
      <BrowserRouter>
        <DoctorDashboard />
      </BrowserRouter>
    );

    // "Analyze X-ray" කියන කොටස තියෙනවද බලනවා
    expect(screen.getByText(/Analyze X-ray/i)).toBeInTheDocument();
  });
});