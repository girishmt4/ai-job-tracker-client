import { cn } from '@/lib/utils';

interface WordmarkProps {
  className?: string;
  showText?: boolean;
}

/**
 * Custom typographic mark — a small geometric "rising line" glyph paired with
 * the name set in the display serif. Deliberately not a stock icon in a gradient box.
 */
export function Wordmark({ className, showText = true }: WordmarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="3" className="opacity-40" />
        <path d="M7 15.5l3.2-3.4 2.4 2.2L17 9" />
        <path d="M14 9h3v3" />
      </svg>
      {showText && (
        <span className="font-serif text-xl font-medium tracking-tight">Jobmind</span>
      )}
    </span>
  );
}
