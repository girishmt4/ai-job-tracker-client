import { useForm } from 'react-hook-form';
import { Copy, RefreshCw, FileText, Sparkles } from 'lucide-react';
import { useStreamingAI } from '@/hooks/useStreamingAI';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/PageHeader';

interface FormData {
  jobDescription: string;
  currentSummary: string;
}

export function ResumeTailor() {
  const { register, handleSubmit } = useForm<FormData>();
  const { output, isStreaming, error, stream, reset } = useStreamingAI();

  async function onSubmit(data: FormData) {
    await stream('/ai/resume-tailor', data);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Resume Tailor"
        description="Generate a tailored resume summary for any job description"
        icon={<FileText className="h-5 w-5" />}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label>Job Description</Label>
          <Textarea
            {...register('jobDescription', { required: true })}
            placeholder="Paste the job description here…"
            className="min-h-[280px] resize-none"
          />
        </div>
        <div className="space-y-2">
          <Label>Current Resume Summary</Label>
          <Textarea
            {...register('currentSummary', { required: true })}
            placeholder="Paste your current resume summary here…"
            className="min-h-[280px] resize-none"
          />
        </div>
        <div className="lg:col-span-2 flex gap-2">
          <Button type="submit" disabled={isStreaming} className="gap-2 shadow-glow">
            <Sparkles className="h-4 w-4" />
            {isStreaming ? 'Generating…' : 'Generate Tailored Summary'}
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
              <Sparkles className="h-4 w-4 text-primary" /> Generated Summary
            </p>
            {output && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(output)}
              >
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
