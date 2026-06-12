import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Search, ExternalLink, Briefcase } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/card';
import { AddEditModal } from '@/components/applications/AddEditModal';
import { Skeleton } from '@/components/ui/skeleton';
import type { Application, ApplicationStatus } from '@/types';

const WORK_MODEL_STYLES: Record<string, string> = {
  REMOTE: 'bg-teal-700/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300',
  HYBRID: 'bg-slate-600/10 text-slate-700 dark:bg-slate-400/10 dark:text-slate-300',
  ON_SITE: 'bg-amber-600/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300',
};

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
    <div className="space-y-5">
      <PageHeader
        title="Applications"
        description={`${total} total application${total === 1 ? '' : 's'}`}
        icon={<Briefcase className="h-5 w-5" />}
        actions={
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Application
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="w-full pl-9"
            placeholder="Search company or role…"
            value={search}
            onChange={(e) => setParam('search', e.target.value)}
          />
        </div>
        <Select
          className="w-full sm:w-48"
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
          className="w-full sm:w-40"
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
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 text-left font-semibold">Company</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">Location</th>
              <th className="px-4 py-3 text-left font-semibold">Model</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Applied</th>
              <th className="px-4 py-3 text-left font-semibold">Link</th>
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
                  className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-accent/50"
                  onClick={() => navigate(`/applications/${app.id}`)}
                >
                  <td className="px-4 py-3 font-semibold">{app.companyName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{app.jobTitle}</td>
                  <td className="px-4 py-3 text-muted-foreground">{app.location || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        WORK_MODEL_STYLES[app.workModel] ?? ''
                      }`}
                    >
                      {app.workModel.replace('_', ' ').toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status as ApplicationStatus} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {format(new Date(app.dateApplied), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    {app.jobUrl ? (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10"
                      >
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
      </Card>

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
