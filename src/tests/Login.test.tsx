import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { Login } from '@/pages/Login';
import api from '@/lib/api';

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe('Login Component', () => {
  it('should render email and password fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should render Google OAuth button', () => {
    renderLogin();
    expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
  });

  it('should show validation error for invalid email', async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'notanemail' } });
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('should show error message on failed login', async () => {
    vi.mocked(api.post).mockRejectedValueOnce(new Error('Unauthorized'));
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });
});
