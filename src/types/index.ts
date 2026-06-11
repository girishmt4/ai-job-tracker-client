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
  APPLIED: { label: 'Applied', className: 'bg-blue-100 text-blue-800' },
  INTERVIEW_SCHEDULED: { label: 'Interview Scheduled', className: 'bg-yellow-100 text-yellow-800' },
  INTERVIEW_DONE: { label: 'Interview Done', className: 'bg-purple-100 text-purple-800' },
  OFFER_RECEIVED: { label: 'Offer Received', className: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
  GHOSTED: { label: 'Ghosted', className: 'bg-gray-100 text-gray-800' },
};
