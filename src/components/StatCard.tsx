import type { LucideIcon } from 'lucide-react';
import { ACCENTS, type AccentKey } from '@/lib/accents';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  accent: AccentKey;
  className?: string;
  style?: React.CSSProperties;
}

export function StatCard({ label, value, icon: Icon, accent, className, style }: StatCardProps) {
  const a = ACCENTS[accent];
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === 'dark';

  const cssVars = {
    '--sc-fill': dark ? a.fill.dark : a.fill.light,
    '--sc-on': dark ? a.on.dark : a.on.light,
  } as React.CSSProperties;

  return (
    <div
      style={{ ...style, ...cssVars }}
      className={cn(
        'stat-card group relative cursor-pointer overflow-hidden rounded-lg border bg-card p-4',
        className
      )}
    >
      <span className={cn('sc-bar absolute inset-y-0 left-0 w-1', a.bar)} />
      <div className="flex items-center justify-between pl-1.5">
        <p className="sc-dim text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <span className={cn('sc-tile flex h-7 w-7 items-center justify-center rounded', a.tile)}>
          <Icon className={cn('sc-icon h-4 w-4', a.icon)} />
        </span>
      </div>
      <p className="nums mt-3 pl-1.5 font-serif text-4xl font-medium leading-none">{value}</p>
    </div>
  );
}
