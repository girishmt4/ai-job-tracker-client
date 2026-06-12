import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="relative flex-1 overflow-y-auto">
        {/* ambient gradient backdrop */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-6xl p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
