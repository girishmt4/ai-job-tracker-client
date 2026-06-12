import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Mail,
  MessageSquare,
  BarChart2,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

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

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  async function handleLogout() {
    await api.post('/auth/logout').catch(() => {});
    logout();
    navigate('/login');
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card/80 backdrop-blur">
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-2.5">
          <div className="gradient-brand flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none text-gradient-brand">JobMind</h1>
            <p className="mt-0.5 text-[11px] text-muted-foreground">AI job search</p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'gradient-brand text-white shadow-glow'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-transform group-hover:scale-110',
                          !isActive && 'group-hover:text-primary'
                        )}
                      />
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
        <div className="mb-2 flex items-center gap-3 rounded-lg px-2 py-2">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full ring-2 ring-primary/20" />
          ) : (
            <div className="gradient-brand flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
