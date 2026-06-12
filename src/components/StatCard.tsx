import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ACCENTS, type AccentKey } from '@/lib/accents';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  accent: AccentKey;
  hint?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function StatCard({ label, value, icon: Icon, accent, hint, className, style }: StatCardProps) {
  const a = ACCENTS[accent];
  return (
    <Card
      interactive
      style={style}
      className={cn('group relative overflow-hidden p-5', a.card, a.ring, className)}
    >
      {/* decorative glow */}
      <div
        className={cn(
          'pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40',
          a.iconWrap
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
          {hint && <p className={cn('mt-1 text-xs font-medium', a.text)}>{hint}</p>}
        </div>
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-110',
            a.iconWrap
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
