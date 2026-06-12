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
    className: 'border border-slate-600/20 bg-slate-600/10 text-slate-700 dark:border-slate-400/20 dark:bg-slate-400/10 dark:text-slate-300',
  },
  INTERVIEW_SCHEDULED: {
    label: 'Interview Scheduled',
    className: 'border border-amber-600/20 bg-amber-600/10 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300',
  },
  INTERVIEW_DONE: {
    label: 'Interview Done',
    className: 'border border-teal-700/20 bg-teal-700/10 text-teal-700 dark:border-teal-400/20 dark:bg-teal-400/10 dark:text-teal-300',
  },
  OFFER_RECEIVED: {
    label: 'Offer Received',
    className: 'border border-emerald-800/20 bg-emerald-800/10 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'border border-rose-800/20 bg-rose-800/10 text-rose-800 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300',
  },
  GHOSTED: {
    label: 'Ghosted',
    className: 'border border-stone-500/20 bg-stone-500/10 text-stone-600 dark:border-stone-400/20 dark:bg-stone-400/10 dark:text-stone-300',
  },
};
