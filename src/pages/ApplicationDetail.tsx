import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, ExternalLink, Edit, Trash2, Bell } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { AddEditModal } from '@/components/applications/AddEditModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Application, ApplicationStatus } from '@/types';

export function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    api
      .get<{ application: Application }>(`/applications/${id}`)
      .then(({ data }) => setApplication(data.application))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    await api.delete(`/applications/${id}`);
    navigate('/applications');
  }

  async function handleFollowUp() {
    const { data } = await api.patch<{ application: Application }>(`/applications/${id}/follow-up`);
    setApplication(data.application);
  }

  if (loading) return <div className="text-muted-foreground">Loading…</div>;
  if (!application) return <div className="text-muted-foreground">Application not found</div>;

  const fields = [
    { label: 'Company', value: application.companyName },
    { label: 'Job Title', value: application.jobTitle },
    { label: 'Location', value: application.location },
    { label: 'Work Model', value: application.workModel.replace('_', ' ') },
    { label: 'Date Applied', value: format(new Date(application.dateApplied), 'PPP') },
    { label: 'Salary Expected', value: application.salaryExpected },
    { label: 'Contact Person', value: application.contactPerson },
    { label: 'Follow-up Sent', value: application.followUpSent ? 'Yes' : 'No' },
  ];

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <Link
        to="/applications"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to applications
      </Link>

      <div className="gradient-brand relative overflow-hidden rounded-2xl p-6 text-white shadow-glow">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold backdrop-blur">
            {application.companyName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold leading-tight">{application.companyName}</h1>
            <p className="text-white/80">{application.jobTitle}</p>
          </div>
          <StatusBadge status={application.status as ApplicationStatus} className="bg-white/90 text-foreground ring-0" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map(({ label, value }) => (
          <div key={label} className="rounded-xl border bg-card p-4 shadow-soft">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-1 text-sm font-semibold">{value || '—'}</p>
          </div>
        ))}
        {application.jobUrl && (
          <div className="rounded-xl border bg-card p-4 shadow-soft">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Job URL</p>
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Open posting <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>

      {application.notes && (
        <div className="rounded-xl border bg-card p-4 shadow-soft">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Notes</p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{application.notes}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setEditOpen(true)} className="gap-2">
          <Edit className="h-4 w-4" /> Edit
        </Button>
        {!application.followUpSent && (
          <Button variant="outline" onClick={handleFollowUp} className="gap-2">
            <Bell className="h-4 w-4" /> Mark Follow-up Sent
          </Button>
        )}
        <Button variant="destructive" onClick={() => setDeleteOpen(true)} className="gap-2">
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      </div>

      <AddEditModal
        open={editOpen}
        onOpenChange={setEditOpen}
        application={application}
        onSaved={setApplication}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Application</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete the application for{' '}
            <strong>{application.companyName}</strong>? This cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
