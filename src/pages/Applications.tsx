import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Search, ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { AddEditModal } from '@/components/applications/AddEditModal';
import { Skeleton } from '@/components/ui/skeleton';
import type { Application, ApplicationStatus } from '@/types';

interface ApplicationsResponse {
  applications: Application[];
  total: number;
  page: number;
  totalPages: number;
}

export function Applications() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const status = searchParams.get('status') || '';
  const workModel = searchParams.get('workModel') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (workModel) params.set('workModel', workModel);
    if (search) params.set('search', search);
    params.set('page', String(page));

    api
      .get<ApplicationsResponse>(`/applications?${params}`)
      .then(({ data }) => {
        setApplications(data.applications);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [status, workModel, search, page]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  }

  function handleSaved(app: Application) {
    setApplications((prev) => {
      const idx = prev.findIndex((a) => a.id === app.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = app;
        return next;
      }
      return [app, ...prev];
    });
    setTotal((t) => t + 1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-muted-foreground">{total} total</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Application
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 w-56"
            placeholder="Search company or role…"
            value={search}
            onChange={(e) => setParam('search', e.target.value)}
          />
        </div>
        <Select
          className="w-48"
          value={status}
          onChange={(e) => setParam('status', e.target.value)}
          placeholder="All statuses"
          options={[
            { value: '', label: 'All statuses' },
            { value: 'APPLIED', label: 'Applied' },
            { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled' },
            { value: 'INTERVIEW_DONE', label: 'Interview Done' },
            { value: 'OFFER_RECEIVED', label: 'Offer Received' },
            { value: 'REJECTED', label: 'Rejected' },
            { value: 'GHOSTED', label: 'Ghosted' },
          ]}
        />
        <Select
          className="w-40"
          value={workModel}
          onChange={(e) => setParam('workModel', e.target.value)}
          placeholder="All models"
          options={[
            { value: '', label: 'All models' },
            { value: 'REMOTE', label: 'Remote' },
            { value: 'HYBRID', label: 'Hybrid' },
            { value: 'ON_SITE', label: 'On-site' },
          ]}
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Company</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Location</th>
              <th className="px-4 py-3 text-left font-medium">Model</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Applied</th>
              <th className="px-4 py-3 text-left font-medium">Link</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No applications found
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b hover:bg-muted/30 cursor-pointer"
                  onClick={() => navigate(`/applications/${app.id}`)}
                >
                  <td className="px-4 py-3 font-medium">{app.companyName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{app.jobTitle}</td>
                  <td className="px-4 py-3 text-muted-foreground">{app.location || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">
                    {app.workModel.replace('_', ' ').toLowerCase()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status as ApplicationStatus} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {format(new Date(app.dateApplied), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    {app.jobUrl ? (
                      <a href={app.jobUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setParam('page', String(page - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setParam('page', String(page + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <AddEditModal open={modalOpen} onOpenChange={setModalOpen} onSaved={handleSaved} />
    </div>
  );
}
