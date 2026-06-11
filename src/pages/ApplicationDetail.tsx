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
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to="/applications" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{application.companyName}</h1>
          <p className="text-muted-foreground">{application.jobTitle}</p>
        </div>
        <StatusBadge status={application.status as ApplicationStatus} />
      </div>

      <div className="rounded-lg border bg-card divide-y">
        {fields.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value || '—'}</span>
          </div>
        ))}
        {application.jobUrl && (
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-muted-foreground">Job URL</span>
            <a href={application.jobUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
              Open <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
        {application.notes && (
          <div className="px-4 py-3">
            <p className="text-sm text-muted-foreground mb-1">Notes</p>
            <p className="text-sm whitespace-pre-wrap">{application.notes}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={() => setEditOpen(true)}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
        {!application.followUpSent && (
          <Button variant="outline" onClick={handleFollowUp}>
            <Bell className="mr-2 h-4 w-4" /> Mark Follow-up Sent
          </Button>
        )}
        <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
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
