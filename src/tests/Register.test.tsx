import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Register } from '@/pages/Register';

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
}

describe('Register Component', () => {
  it('should render all required fields', () => {
    renderRegister();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should show password strength indicator when typing', async () => {
    renderRegister();
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password1' } });
    await waitFor(() => {
      expect(screen.getByText(/good|strong|fair/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for weak password', async () => {
    renderRegister();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'weak' } });
    fireEvent.submit(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    });
  });
});
