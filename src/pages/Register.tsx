import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthShell } from '@/components/layout/AuthShell';
import type { User } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'At least 1 uppercase letter')
    .regex(/\d/, 'At least 1 number'),
});
type FormData = z.infer<typeof schema>;

function passwordStrength(password: string): { label: string; color: string; width: string } {
  if (password.length === 0) return { label: '', color: 'bg-muted', width: '0%' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { label: 'Weak', color: 'bg-destructive', width: '25%' };
  if (score === 2) return { label: 'Fair', color: 'bg-warning', width: '50%' };
  if (score === 3) return { label: 'Good', color: 'bg-info', width: '75%' };
  return { label: 'Strong', color: 'bg-success', width: '100%' };
}

export function Register() {
  const { isAuthenticated, setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const password = watch('password', '');
  const strength = passwordStrength(password);

  async function onSubmit(data: FormData) {
    try {
      const res = await api.post<{ accessToken: string; user: User }>('/auth/register', data);
      setAuth(res.data.user, res.data.accessToken);
    } catch {
      setError('root', { message: 'Registration failed. Try a different email.' });
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Start tracking your job search in minutes">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="name" placeholder="Jane Doe" className="pl-9" {...register('name')} />
          </div>
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="email" type="email" placeholder="you@example.com" className="pl-9" {...register('email')} />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="password" type="password" placeholder="••••••••" className="pl-9" {...register('password')} />
          </div>
          {password && (
            <div className="mt-2 space-y-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                  style={{ width: strength.width }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Password strength: <span className="font-medium text-foreground">{strength.label}</span>
              </p>
            </div>
          )}
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        {errors.root && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errors.root.message}
          </div>
        )}
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
