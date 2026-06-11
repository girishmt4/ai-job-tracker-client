import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, CheckCircle2, XCircle } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  A: 'text-green-600',
  B: 'text-blue-600',
  C: 'text-yellow-600',
  D: 'text-orange-600',
  F: 'text-red-600',
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
      <div>
        <h1 className="text-2xl font-bold">ATS Analyzer</h1>
        <p className="text-muted-foreground">Score your resume against any job description</p>
      </div>

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

        <Button type="submit" disabled={loading}>
          {loading ? 'Analyzing…' : 'Analyze Resume'}
        </Button>
      </form>

      {result && (
        <div className="space-y-6">
          {/* Score + summary */}
          <div className="flex gap-8 items-start rounded-lg border p-6">
            <ScoreCircle score={result.score} grade={result.grade} />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Summary</p>
              <p className="text-sm text-muted-foreground">{result.summary}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Strengths */}
            <div className="rounded-lg border p-4 space-y-2">
              <p className="font-medium text-sm">Strengths</p>
              {result.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  {s}
                </div>
              ))}
            </div>
            {/* Gaps */}
            <div className="rounded-lg border p-4 space-y-2">
              <p className="font-medium text-sm">Gaps</p>
              {result.gaps.map((g, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  {g}
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="rounded-lg border p-4 space-y-3">
            <p className="font-medium text-sm">Keywords</p>
            <div className="grid gap-3 lg:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Found ({result.keywords.found.length})</p>
                <div className="flex flex-wrap gap-1">
                  {result.keywords.found.map((k) => (
                    <span key={k} className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">{k}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Missing ({result.keywords.missing.length})</p>
                <div className="flex flex-wrap gap-1">
                  {result.keywords.missing.map((k) => (
                    <span key={k} className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800">{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
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
        </div>
      )}
    </div>
  );
}
