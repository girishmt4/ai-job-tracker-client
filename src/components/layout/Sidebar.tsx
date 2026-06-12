import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Mail,
  MessageSquare,
  BarChart2,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Wordmark } from '@/components/Wordmark';

const navSections: { title: string; items: { to: string; icon: typeof LayoutDashboard; label: string }[] }[] = [
  {
    title: 'Overview',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/applications', icon: Briefcase, label: 'Applications' },
    ],
  },
  {
    title: 'AI Tools',
    items: [
      { to: '/ai/resume-tailor', icon: FileText, label: 'Resume Tailor' },
      { to: '/ai/cover-letter', icon: Mail, label: 'Cover Letter' },
      { to: '/ai/interview-prep', icon: MessageSquare, label: 'Interview Prep' },
      { to: '/ai/ats-analyzer', icon: BarChart2, label: 'ATS Analyzer' },
    ],
  },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  async function handleLogout() {
    onNavigate?.();
    await api.post('/auth/logout').catch(() => {});
    logout();
    navigate('/login');
  }

  return (
    <aside className={cn('flex h-full w-64 shrink-0 flex-col border-r bg-card', className)}>
      <div className="flex items-center justify-between px-5 py-5">
        <Wordmark />
        <ThemeToggle />
      </div>

      <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-2">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 pb-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground/60">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'relative flex items-center gap-3 rounded-md py-2 pl-4 pr-3 text-sm transition-colors',
                      isActive
                        ? 'bg-accent font-medium text-foreground'
                        : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary" />
                      )}
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t p-3">
        <div className="mb-1 flex items-center gap-3 px-2 py-2">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-serif text-sm font-medium text-secondary-foreground">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
