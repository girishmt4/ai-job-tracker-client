import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import { Briefcase, CalendarDays, TrendingUp, MessagesSquare, Award, AlertCircle, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/StatCard';
import { PageHeader } from '@/components/PageHeader';
import type { StatsOverview, TimelineEntry, StatusCount, FollowUp, ApplicationStatus } from '@/types';
import { STATUS_CONFIG } from '@/types';
import type { AccentKey } from '@/lib/accents';

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  APPLIED: '#3b82f6',
  INTERVIEW_SCHEDULED: '#eab308',
  INTERVIEW_DONE: '#a855f7',
  OFFER_RECEIVED: '#22c55e',
  REJECTED: '#ef4444',
  GHOSTED: '#6b7280',
};

export function Dashboard() {
  const [overview, setOverview] = useState<StatsOverview | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [byStatus, setByStatus] = useState<StatusCount[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<StatsOverview>('/stats/overview'),
      api.get<{ data: TimelineEntry[] }>('/stats/timeline'),
      api.get<{ data: StatusCount[] }>('/stats/by-status'),
      api.get<{ followUps: FollowUp[] }>('/applications/follow-ups'),
    ])
      .then(([overviewRes, timelineRes, statusRes, followUpsRes]) => {
        setOverview(overviewRes.data);
        setTimeline(timelineRes.data.data);
        setByStatus(statusRes.data.data);
        setFollowUps(followUpsRes.data.followUps);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64 rounded-lg" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    );
  }

  const statCards: { label: string; value: number; icon: typeof Briefcase; accent: AccentKey }[] = [
    { label: 'Total Applications', value: overview?.totalApplications ?? 0, icon: Briefcase, accent: 'violet' },
    { label: 'This Week', value: overview?.thisWeek ?? 0, icon: CalendarDays, accent: 'blue' },
    { label: 'This Month', value: overview?.thisMonth ?? 0, icon: TrendingUp, accent: 'cyan' },
    { label: 'Interviews', value: overview?.interviews ?? 0, icon: MessagesSquare, accent: 'amber' },
    { label: 'Offers', value: overview?.offers ?? 0, icon: Award, accent: 'emerald' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Your job search at a glance"
        icon={<TrendingUp className="h-5 w-5" />}
      />

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {statCards.map((stat, i) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            accent={stat.accent}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>

      {/* Follow-up reminders */}
      {followUps.length > 0 && (
        <Card className="overflow-hidden border-amber-300/60 bg-amber-50/70 dark:border-amber-500/30 dark:bg-amber-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-amber-700 dark:text-amber-300">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/20">
                <AlertCircle className="h-5 w-5" />
              </span>
              {followUps.length} application{followUps.length > 1 ? 's' : ''} need follow-up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {followUps.map((f) => (
                <Link
                  key={f.id}
                  to={`/applications/${f.id}`}
                  className="group flex items-center justify-between rounded-lg bg-card/80 px-3 py-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <div>
                    <p className="text-sm font-semibold">{f.companyName}</p>
                    <p className="text-xs text-muted-foreground">{f.jobTitle}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                    {f.daysSinceApplied} days ago
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Timeline chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Applications (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {timeline.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={timeline}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--brand-from))" />
                      <stop offset="100%" stopColor="hsl(var(--brand-to))" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d: string) => format(new Date(d), 'MMM d')}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    stroke="hsl(var(--border))"
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    stroke="hsl(var(--border))"
                  />
                  <Tooltip
                    labelFormatter={(d: string) => format(new Date(d), 'MMM d, yyyy')}
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                      color: 'hsl(var(--popover-foreground))',
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5, fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Status breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">By Status</CardTitle>
          </CardHeader>
          <CardContent>
            {byStatus.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={byStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                  >
                    {byStatus.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                    ))}
                  </Pie>
                  <Legend
                    formatter={(value: string) => (
                      <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: 12 }}>
                        {STATUS_CONFIG[value as ApplicationStatus]?.label ?? value}
                      </span>
                    )}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                      color: 'hsl(var(--popover-foreground))',
                      fontSize: 12,
                    }}
                    formatter={(value: number, name: string) => [
                      value,
                      STATUS_CONFIG[name as ApplicationStatus]?.label ?? name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
