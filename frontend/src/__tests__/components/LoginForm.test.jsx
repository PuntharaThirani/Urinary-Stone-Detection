import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock useNavigate
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Mock loginUser API call
vi.mock('../../services/api', () => ({
  loginUser: vi.fn(),
}));

// Helper — render with router
const renderLoginForm = () => {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <LoginForm />
    </MemoryRouter>
  );
};


describe('🔐 LoginForm Component Tests', () => {

  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  
  // 1. Email Input Renders
 
  it('renders email input field', () => {
    renderLoginForm();

    // Placeholder text match 
    const emailInput = screen.getByPlaceholderText('name@example.com');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  
  // 2. Password Input Renders
  
  it('renders password input field', () => {
    renderLoginForm();

    const passwordInput = screen.getByPlaceholderText('••••••••');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  
  // 3. Sign In Button Renders
  
  it('renders Sign In button', () => {
    renderLoginForm();

    // Button text "Sign In" 
    const button = screen.getByRole('button', { name: /sign in/i });
    expect(button).toBeInTheDocument();
  });

  
  // 4. Role Tabs Render
 
  it('renders role selection tabs', () => {
    renderLoginForm();

    expect(screen.getByRole('button', { name: /doctor/i  })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /patient/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /staff/i   })).toBeInTheDocument();
  });

 
  // 5. Email Input — Type Value
  
  it('updates email input value on change', () => {
    renderLoginForm();

    const emailInput = screen.getByPlaceholderText('name@example.com');
    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    });

    expect(emailInput.value).toBe('test@example.com');
  });

  
  // 6. Password Input — Type Value
  
  it('updates password input value on change', () => {
    renderLoginForm();

    const passwordInput = screen.getByPlaceholderText('••••••••');
    fireEvent.change(passwordInput, {
      target: { value: 'password123' },
    });

    expect(passwordInput.value).toBe('password123');
  });

  
  // 7. Doctor Tab — Default Selected

  it('doctor tab is selected by default', () => {
    renderLoginForm();

    const doctorTab = screen.getByRole('button', { name: /doctor/i });
    expect(doctorTab).toHaveClass('bg-blue-600');
  });

 
  // 8. Toggle — Login to Register
 
  it('toggles to register form when Create account clicked', () => {
    renderLoginForm();

    const toggleBtn = screen.getByRole('button', {
      name: /create an account/i,
    });
    fireEvent.click(toggleBtn);

    expect(
      screen.getByText(/register for uroscan ai/i)
    ).toBeInTheDocument();
  });

 
  // 9. Form Submit — Empty Fields
  
  it('does not submit with empty fields', async () => {
    const { loginUser } = await import('../../services/api');
    renderLoginForm();

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    // API should not be called
    expect(loginUser).not.toHaveBeenCalled();
  });

});