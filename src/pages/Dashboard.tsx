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
  APPLIED: '#5b7b97',
  INTERVIEW_SCHEDULED: '#c98a2b',
  INTERVIEW_DONE: '#3f8f86',
  OFFER_RECEIVED: '#2f7d57',
  REJECTED: '#b04a3a',
  GHOSTED: '#8a8678',
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
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-lg" />
          <Skeleton className="h-72 rounded-lg" />
        </div>
      </div>
    );
  }

  const statCards: { label: string; value: number; icon: typeof Briefcase; accent: AccentKey }[] = [
    { label: 'Total Applications', value: overview?.totalApplications ?? 0, icon: Briefcase, accent: 'pine' },
    { label: 'This Week', value: overview?.thisWeek ?? 0, icon: CalendarDays, accent: 'slate' },
    { label: 'This Month', value: overview?.thisMonth ?? 0, icon: TrendingUp, accent: 'teal' },
    { label: 'Interviews', value: overview?.interviews ?? 0, icon: MessagesSquare, accent: 'ochre' },
    { label: 'Offers', value: overview?.offers ?? 0, icon: Award, accent: 'clay' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Your job search at a glance" />

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
        <div className="rounded-lg border border-l-2 border-l-warning bg-card">
          <div className="flex items-center gap-2 border-b px-4 py-3 text-sm font-medium">
            <AlertCircle className="h-4 w-4 text-warning" />
            {followUps.length} application{followUps.length > 1 ? 's' : ''} awaiting follow-up
          </div>
          <ul className="divide-y">
            {followUps.map((f) => (
              <li key={f.id}>
                <Link
                  to={`/applications/${f.id}`}
                  className="group flex items-center justify-between px-4 py-3 transition-colors hover:bg-accent/50"
                >
                  <div>
                    <p className="text-sm font-medium">{f.companyName}</p>
                    <p className="text-xs text-muted-foreground">{f.jobTitle}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {f.daysSinceApplied}d ago
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
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
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
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
