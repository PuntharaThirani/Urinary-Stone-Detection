import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { describe, it, expect, vi } from 'vitest';

// useNavigate Mock කරනවා (Error එන එක නවත්තන්න)
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('LoginForm Component', () => {
  
  it('renders email and password inputs', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    // Inputs තියෙනවද බලනවා
    expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  });

  it('updates input values on change', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/Email Address/i);
    
    // Type කරලා බලනවා
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput.value).toBe('test@example.com');
  });

  it('shows login button', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    // Button එක තියෙනවද බලනවා
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });
});