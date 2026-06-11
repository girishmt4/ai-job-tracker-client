import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import type { Application } from '@/types';

const schema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  location: z.string().optional(),
  workModel: z.enum(['REMOTE', 'HYBRID', 'ON_SITE']).default('HYBRID'),
  status: z
    .enum(['APPLIED', 'INTERVIEW_SCHEDULED', 'INTERVIEW_DONE', 'OFFER_RECEIVED', 'REJECTED', 'GHOSTED'])
    .default('APPLIED'),
  dateApplied: z.string().default(() => format(new Date(), 'yyyy-MM-dd')),
  jobUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  notes: z.string().optional(),
  salaryExpected: z.string().optional(),
  contactPerson: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: Application;
  onSaved: (app: Application) => void;
}

export function AddEditModal({ open, onOpenChange, application, onSaved }: Props) {
  const isEdit = !!application;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: application
      ? { ...application, dateApplied: format(new Date(application.dateApplied), 'yyyy-MM-dd') }
      : { workModel: 'HYBRID', status: 'APPLIED', dateApplied: format(new Date(), 'yyyy-MM-dd') },
  });

  useEffect(() => {
    if (open) {
      reset(
        application
          ? { ...application, dateApplied: format(new Date(application.dateApplied), 'yyyy-MM-dd') }
          : { workModel: 'HYBRID', status: 'APPLIED', dateApplied: format(new Date(), 'yyyy-MM-dd') }
      );
    }
  }, [open, application, reset]);

  async function onSubmit(data: FormData) {
    const payload = { ...data, jobUrl: data.jobUrl || undefined };
    const res = isEdit
      ? await api.put<{ application: Application }>(`/applications/${application!.id}`, payload)
      : await api.post<{ application: Application }>('/applications', payload);
    onSaved(res.data.application);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Application' : 'Add Application'}</DialogTitle>
          <DialogClose onClick={() => onOpenChange(false)} />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Company *</Label>
              <Input {...register('companyName')} />
              {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Job Title *</Label>
              <Input {...register('jobTitle')} />
              {errors.jobTitle && <p className="text-xs text-destructive">{errors.jobTitle.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Location</Label>
              <Input {...register('location')} />
            </div>
            <div className="space-y-1">
              <Label>Date Applied</Label>
              <Input type="date" {...register('dateApplied')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Work Model</Label>
              <Select
                {...register('workModel')}
                options={[
                  { value: 'HYBRID', label: 'Hybrid' },
                  { value: 'REMOTE', label: 'Remote' },
                  { value: 'ON_SITE', label: 'On-site' },
                ]}
              />
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select
                {...register('status')}
                options={[
                  { value: 'APPLIED', label: 'Applied' },
                  { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled' },
                  { value: 'INTERVIEW_DONE', label: 'Interview Done' },
                  { value: 'OFFER_RECEIVED', label: 'Offer Received' },
                  { value: 'REJECTED', label: 'Rejected' },
                  { value: 'GHOSTED', label: 'Ghosted' },
                ]}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Job URL</Label>
            <Input type="url" {...register('jobUrl')} />
            {errors.jobUrl && <p className="text-xs text-destructive">{errors.jobUrl.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Expected Salary</Label>
              <Input {...register('salaryExpected')} placeholder="e.g. €70k–80k" />
            </div>
            <div className="space-y-1">
              <Label>Contact Person</Label>
              <Input {...register('contactPerson')} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Notes</Label>
            <Textarea {...register('notes')} rows={3} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
