import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Wordmark } from '@/components/Wordmark';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const LEDGER = [
  { k: '01', t: 'Log', d: 'Every application, status and follow-up date in one place.' },
  { k: '02', t: 'Tailor', d: 'Draft resume summaries and cover letters per role.' },
  { k: '03', t: 'Prepare', d: 'Build interview questions and check ATS keyword fit.' },
];

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Left — editorial brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary px-12 py-14 text-primary-foreground lg:flex">
        <div className="dot-grid pointer-events-none absolute inset-0 text-primary-foreground/10" />

        <div className="relative">
          <Wordmark className="text-primary-foreground" />
        </div>

        <div className="relative max-w-lg">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-primary-foreground/60">
            The job-search ledger
          </p>
          <h2 className="font-serif text-[2.6rem] font-medium leading-[1.1]">
            Keep your search
            <br />
            organised, honest,
            <br />
            and moving forward.
          </h2>

          <ul className="mt-10 space-y-5 border-t border-primary-foreground/15 pt-8">
            {LEDGER.map((item) => (
              <li key={item.k} className="flex gap-4">
                <span className="nums font-serif text-lg text-primary-foreground/50">{item.k}</span>
                <div>
                  <p className="font-medium">{item.t}</p>
                  <p className="text-sm text-primary-foreground/70">{item.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-primary-foreground/45">
          &copy; {new Date().getFullYear()} JobMind
        </p>
      </aside>

      {/* Right — form area */}
      <main className="relative flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="absolute right-6 top-6">
          <ThemeToggle />
        </div>

        <div className="absolute left-6 top-6 lg:hidden">
          <Wordmark />
        </div>

        <div className="w-full max-w-sm animate-fade-in-up">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-medium tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
