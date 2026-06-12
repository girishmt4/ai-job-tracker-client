import { useForm } from 'react-hook-form';
import { Copy, RefreshCw, Mail, Sparkles } from 'lucide-react';
import { useStreamingAI } from '@/hooks/useStreamingAI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/PageHeader';

interface FormData {
  jobDescription: string;
  applicantName: string;
}

export function CoverLetter() {
  const { register, handleSubmit } = useForm<FormData>();
  const { output, isStreaming, error, stream, reset } = useStreamingAI();

  async function onSubmit(data: FormData) {
    await stream('/ai/cover-letter', data);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Cover Letter"
        description="Generate a concise, professional cover note tailored to the role"
        icon={<Mail className="h-5 w-5" />}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label>Your Name</Label>
          <Input {...register('applicantName')} placeholder="Girish Tiwale" className="max-w-xs" />
        </div>
        <div className="space-y-2">
          <Label>Job Description</Label>
          <Textarea
            {...register('jobDescription', { required: true })}
            placeholder="Paste the job description here…"
            className="min-h-[260px] resize-none"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isStreaming} className="gap-2 shadow-glow">
            <Sparkles className="h-4 w-4" />
            {isStreaming ? 'Generating…' : 'Generate Cover Letter'}
          </Button>
          {output && (
            <Button type="button" variant="outline" onClick={reset}>
              <RefreshCw className="mr-2 h-4 w-4" /> Clear
            </Button>
          )}
        </div>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {(output || isStreaming) && (
        <div className="animate-fade-in rounded-xl border bg-card p-5 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" /> Generated Cover Letter
            </p>
            {output && (
              <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(output)}>
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
            )}
          </div>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {output}
            {isStreaming && <span className="ml-0.5 inline-block w-0.5 h-4 bg-foreground animate-pulse" />}
          </p>
        </div>
      )}
    </div>
  );
}
