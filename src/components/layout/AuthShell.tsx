import { Sparkles, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import heroImage from '@/assets/auth-hero.png';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const HIGHLIGHTS = [
  'Track every application in one place',
  'AI-tailored resumes & cover letters',
  'Smart interview prep & ATS scoring',
];

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — branded hero */}
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={heroImage}
          alt="People advancing their careers"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="gradient-brand absolute inset-0 opacity-80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">JobMind</span>
          </div>

          <div className="max-w-md space-y-6">
            <h2 className="text-4xl font-bold leading-tight drop-shadow-sm">
              Land your next role, faster.
            </h2>
            <p className="text-white/80">
              Your AI-powered command center for the entire job search — from first
              application to signed offer.
            </p>
            <ul className="space-y-3">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/90">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-white" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/60">
            &copy; {new Date().getFullYear()} JobMind. Built for ambitious job seekers.
          </p>
        </div>
      </div>

      {/* Right — form area */}
      <div className="relative flex items-center justify-center bg-background px-6 py-12">
        <div className="absolute right-6 top-6">
          <ThemeToggle />
        </div>

        {/* Mobile brand */}
        <div className="absolute left-6 top-6 flex items-center gap-2 lg:hidden">
          <div className="gradient-brand flex h-8 w-8 items-center justify-center rounded-lg text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-bold">JobMind</span>
        </div>

        <div className="w-full max-w-sm animate-fade-in-up">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
