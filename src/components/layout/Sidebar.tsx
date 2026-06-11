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

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/applications', icon: Briefcase, label: 'Applications' },
  { to: '/ai/resume-tailor', icon: FileText, label: 'Resume Tailor' },
  { to: '/ai/cover-letter', icon: Mail, label: 'Cover Letter' },
  { to: '/ai/interview-prep', icon: MessageSquare, label: 'Interview Prep' },
  { to: '/ai/ats-analyzer', icon: BarChart2, label: 'ATS Analyzer' },
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
    <aside className="flex h-screen w-60 flex-col border-r bg-card">
      <div className="p-6">
        <h1 className="text-lg font-bold text-primary">JobMind</h1>
        <p className="text-xs text-muted-foreground">AI-powered job search</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t p-4">
        <div className="mb-2 flex items-center gap-2">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
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
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
