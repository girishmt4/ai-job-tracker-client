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
import { Briefcase, Calendar, TrendingUp, Star, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { StatsOverview, TimelineEntry, StatusCount, FollowUp, ApplicationStatus } from '@/types';
import { STATUS_CONFIG } from '@/types';

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
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Applications', value: overview?.totalApplications ?? 0, icon: Briefcase },
    { label: 'This Week', value: overview?.thisWeek ?? 0, icon: Calendar },
    { label: 'This Month', value: overview?.thisMonth ?? 0, icon: TrendingUp },
    { label: 'Interviews', value: overview?.interviews ?? 0, icon: Star },
    { label: 'Offers', value: overview?.offers ?? 0, icon: Star },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Your job search at a glance</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {statCards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-3xl font-bold">{value}</p>
                </div>
                <Icon className="h-8 w-8 text-muted-foreground/40" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Follow-up reminders */}
      {followUps.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              {followUps.length} application{followUps.length > 1 ? 's' : ''} need follow-up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {followUps.map((f) => (
                <Link
                  key={f.id}
                  to={`/applications/${f.id}`}
                  className="flex items-center justify-between rounded-md bg-white px-3 py-2 hover:bg-yellow-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{f.companyName}</p>
                    <p className="text-xs text-muted-foreground">{f.jobTitle}</p>
                  </div>
                  <span className="text-xs text-yellow-700">{f.daysSinceApplied} days ago</span>
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
            <CardTitle>Applications (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {timeline.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d: string) => format(new Date(d), 'MMM d')}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip labelFormatter={(d: string) => format(new Date(d), 'MMM d, yyyy')} />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Status breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>By Status</CardTitle>
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
                    outerRadius={80}
                  >
                    {byStatus.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                    ))}
                  </Pie>
                  <Legend
                    formatter={(value: string) => STATUS_CONFIG[value as ApplicationStatus]?.label ?? value}
                  />
                  <Tooltip
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
