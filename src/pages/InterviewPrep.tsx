import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MessageSquare, Sparkles } from 'lucide-react';
import api from '@/lib/api';
import { useStreamingAI } from '@/hooks/useStreamingAI';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { PageHeader } from '@/components/PageHeader';
import type { InterviewQuestions, InterviewQuestion } from '@/types';

const CATEGORY_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  react: 'React',
  systemDesign: 'System Design',
  behavioral: 'Behavioral',
};

const CATEGORY_DOT: Record<string, string> = {
  javascript: 'bg-amber-500',
  react: 'bg-cyan-500',
  systemDesign: 'bg-violet-500',
  behavioral: 'bg-emerald-500',
};

interface FormData {
  jobDescription: string;
}

function QuestionCard({
  question,
  category,
  jobDescription,
}: {
  question: InterviewQuestion;
  category: string;
  jobDescription: string;
}) {
  const { output, isStreaming, stream } = useStreamingAI();

  return (
    <AccordionItem value={question.id}>
      <AccordionTrigger>{question.question}</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Key Points</p>
            <ul className="list-disc list-inside space-y-0.5">
              {question.keyPoints.map((kp, i) => (
                <li key={i} className="text-sm">{kp}</li>
              ))}
            </ul>
          </div>
          {!output && !isStreaming && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => stream('/ai/interview-prep/answer', { question: question.question, category, context: jobDescription })}
            >
              Generate Model Answer
            </Button>
          )}
          {(output || isStreaming) && (
            <div className="rounded-md bg-muted/40 p-3 text-sm whitespace-pre-wrap leading-relaxed">
              {output}
              {isStreaming && <span className="ml-0.5 inline-block w-0.5 h-4 bg-foreground animate-pulse" />}
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function InterviewPrep() {
  const [questions, setQuestions] = useState<InterviewQuestions | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, watch } = useForm<FormData>();
  const jobDescription = watch('jobDescription', '');

  async function onSubmit(data: FormData) {
    setGenerating(true);
    setError(null);
    try {
      const { data: result } = await api.post<InterviewQuestions>('/ai/interview-prep', data);
      setQuestions(result);
    } catch {
      setError('Failed to generate questions. Please try again.');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Interview Prep"
        description="Generate tailored interview questions with model answers"
        icon={<MessageSquare className="h-5 w-5" />}
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
        <Button type="submit" disabled={generating} className="gap-2 shadow-glow">
          <Sparkles className="h-4 w-4" />
          {generating ? 'Generating questions…' : 'Generate Questions'}
        </Button>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {questions && (
        <div className="space-y-6">
          {Object.entries(questions.questions).map(([category, qs]) =>
            qs.length > 0 ? (
              <div key={category} className="animate-fade-in">
                <h2 className="mb-2 flex items-center gap-2 font-semibold">
                  <span className={`h-2.5 w-2.5 rounded-full ${CATEGORY_DOT[category] ?? 'bg-primary'}`} />
                  {CATEGORY_LABELS[category] ?? category}
                  <span className="text-xs font-normal text-muted-foreground">({qs.length})</span>
                </h2>
                <Accordion type="single">
                  {qs.map((q: InterviewQuestion) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      category={category}
                      jobDescription={jobDescription}
                    />
                  ))}
                </Accordion>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
