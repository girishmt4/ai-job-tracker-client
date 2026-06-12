import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Wordmark } from '@/components/Wordmark';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { cn } from '@/lib/utils';

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent body scroll behind the open drawer.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile drawer + backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-foreground/40 transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <Sidebar
        onNavigate={() => setOpen(false)}
        className={cn(
          'fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b bg-card px-4 py-2.5 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Wordmark />
          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 md:px-10 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
