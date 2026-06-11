import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { Dashboard } from '@/pages/Dashboard';
import api from '@/lib/api';

vi.mocked(api.get).mockImplementation((url: string) => {
  if (url.includes('overview')) {
    return Promise.resolve({
      data: { totalApplications: 5, thisWeek: 2, thisMonth: 5, interviews: 1, offers: 0, followUpsNeeded: 1 },
    });
  }
  if (url.includes('timeline')) return Promise.resolve({ data: { data: [] } });
  if (url.includes('by-status')) return Promise.resolve({ data: { data: [] } });
  if (url.includes('follow-ups')) return Promise.resolve({ data: { followUps: [] } });
  return Promise.resolve({ data: {} });
});

describe('Dashboard Component', () => {
  it('should render total applications count', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    });
    expect(screen.getByText(/total applications/i)).toBeInTheDocument();
  });

  it('should render zero state when no applications', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { totalApplications: 0, thisWeek: 0, thisMonth: 0, interviews: 0, offers: 0, followUpsNeeded: 0, data: [], followUps: [] },
    });
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getAllByText('0').length).toBeGreaterThan(0);
    });
  });
});
