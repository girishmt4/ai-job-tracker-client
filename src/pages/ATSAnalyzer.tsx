import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, CheckCircle2, XCircle, BarChart2, FileCheck2 } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/PageHeader';
import type { ATSResult } from '@/types';

interface FormData {
  jobDescription: string;
}

const PRIORITY_VARIANT = {
  HIGH: 'destructive',
  MEDIUM: 'secondary',
  LOW: 'outline',
} as const;

const GRADE_COLOR: Record<string, string> = {
  A: 'text-emerald-600 dark:text-emerald-400',
  B: 'text-blue-600 dark:text-blue-400',
  C: 'text-amber-600 dark:text-amber-400',
  D: 'text-orange-600 dark:text-orange-400',
  F: 'text-rose-600 dark:text-rose-400',
};

function ScoreCircle({ score, grade }: { score: number; grade: string }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          className="transition-all duration-1000"
        />
        <text x="70" y="66" textAnchor="middle" className="text-3xl font-bold" fill="currentColor" fontSize="28">
          {score}
        </text>
        <text x="70" y="86" textAnchor="middle" fill="currentColor" fontSize="12" opacity="0.6">
          / 100
        </text>
      </svg>
      <span className={`text-4xl font-bold ${GRADE_COLOR[grade] ?? ''}`}>{grade}</span>
    </div>
  );
}

export function ATSAnalyzer() {
  const { register, handleSubmit } = useForm<FormData>();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onSubmit(data: FormData) {
    if (!file) {
      setError('Please upload your resume PDF');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('jobDescription', data.jobDescription);
      formData.append('resume', file);
      const { data: res } = await api.post<ATSResult>('/ai/ats-analyzer', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res);
    } catch {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="ATS Analyzer"
        description="Score your resume against a job description"
        icon={<BarChart2 className="h-4 w-4" />}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label>Job Description</Label>
          <Textarea
            {...register('jobDescription', { required: true })}
            placeholder="Paste the job description here…"
            className="min-h-[200px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label>Resume (PDF)</Label>
          <div
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-input bg-muted/20 p-8 hover:bg-muted/40 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            {file ? (
              <p className="text-sm font-medium">{file.name}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Click to upload PDF (max 5MB)</p>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={loading} className="gap-2">
          <FileCheck2 className="h-4 w-4" />
          {loading ? 'Analyzing…' : 'Analyze resume'}
        </Button>
      </form>

      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Score + summary */}
          <Card className="flex flex-wrap items-center gap-8 p-6">
            <ScoreCircle score={result.score} grade={result.grade} />
            <div className="min-w-[200px] flex-1">
              <p className="mb-1 text-sm font-semibold">Summary</p>
              <p className="text-sm text-muted-foreground">{result.summary}</p>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Strengths */}
            <Card className="space-y-2 border-emerald-300/50 bg-emerald-50/50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" /> Strengths
              </p>
              {result.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  {s}
                </div>
              ))}
            </Card>
            {/* Gaps */}
            <Card className="space-y-2 border-rose-300/50 bg-rose-50/50 p-4 dark:border-rose-500/20 dark:bg-rose-500/5">
              <p className="flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-300">
                <XCircle className="h-4 w-4" /> Gaps
              </p>
              {result.gaps.map((g, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                  {g}
                </div>
              ))}
            </Card>
          </div>

          {/* Keywords */}
          <Card className="space-y-3 p-4">
            <p className="text-sm font-semibold">Keywords</p>
            <div className="grid gap-3 lg:grid-cols-2">
              <div>
                <p className="mb-1.5 text-xs text-muted-foreground">Found ({result.keywords.found.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.keywords.found.map((k) => (
                    <span key={k} className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">{k}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-xs text-muted-foreground">Missing ({result.keywords.missing.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.keywords.missing.map((k) => (
                    <span key={k} className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Suggestions */}
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left font-medium">Section</th>
                  <th className="px-4 py-2 text-left font-medium">Current</th>
                  <th className="px-4 py-2 text-left font-medium">Suggested</th>
                  <th className="px-4 py-2 text-left font-medium">Priority</th>
                </tr>
              </thead>
              <tbody>
                {result.suggestions.map((s, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2 font-medium">{s.section}</td>
                    <td className="px-4 py-2 text-muted-foreground">{s.current}</td>
                    <td className="px-4 py-2">{s.suggested}</td>
                    <td className="px-4 py-2">
                      <Badge variant={PRIORITY_VARIANT[s.priority]}>{s.priority}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
