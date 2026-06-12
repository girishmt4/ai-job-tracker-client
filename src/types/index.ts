export type ApplicationStatus =
  | 'APPLIED'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_DONE'
  | 'OFFER_RECEIVED'
  | 'REJECTED'
  | 'GHOSTED';

export type WorkModel = 'REMOTE' | 'HYBRID' | 'ON_SITE';

export interface Application {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  location?: string;
  workModel: WorkModel;
  status: ApplicationStatus;
  dateApplied: string;
  jobUrl?: string;
  notes?: string;
  salaryExpected?: string;
  contactPerson?: string;
  followUpSent: boolean;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: string;
  createdAt?: string;
}

export interface StatsOverview {
  totalApplications: number;
  thisWeek: number;
  thisMonth: number;
  interviews: number;
  offers: number;
  followUpsNeeded: number;
}

export interface TimelineEntry {
  date: string;
  count: number;
}

export interface StatusCount {
  status: ApplicationStatus;
  count: number;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  keyPoints: string[];
}

export interface InterviewQuestions {
  questions: {
    javascript: InterviewQuestion[];
    react: InterviewQuestion[];
    systemDesign: InterviewQuestion[];
    behavioral: InterviewQuestion[];
  };
}

export interface ATSResult {
  score: number;
  grade: string;
  summary: string;
  strengths: string[];
  gaps: string[];
  suggestions: Array<{
    section: string;
    current: string;
    suggested: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
  keywords: {
    found: string[];
    missing: string[];
  };
}

export interface FollowUp {
  id: string;
  companyName: string;
  jobTitle: string;
  dateApplied: string;
  daysSinceApplied: number;
}

export const STATUS_CONFIG: Record<ApplicationStatus, { label: string; className: string }> = {
  APPLIED: {
    label: 'Applied',
    className: 'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-400/20',
  },
  INTERVIEW_SCHEDULED: {
    label: 'Interview Scheduled',
    className: 'bg-amber-100 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/20',
  },
  INTERVIEW_DONE: {
    label: 'Interview Done',
    className: 'bg-violet-100 text-violet-700 ring-1 ring-violet-600/20 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-400/20',
  },
  OFFER_RECEIVED: {
    label: 'Offer Received',
    className: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/20',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-rose-100 text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-400/20',
  },
  GHOSTED: {
    label: 'Ghosted',
    className: 'bg-slate-100 text-slate-600 ring-1 ring-slate-500/20 dark:bg-slate-500/15 dark:text-slate-300 dark:ring-slate-400/20',
  },
};
