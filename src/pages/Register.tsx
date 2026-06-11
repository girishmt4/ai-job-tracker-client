import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
  if (score === 2) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' };
  if (score === 3) return { label: 'Good', color: 'bg-blue-500', width: '75%' };
  return { label: 'Strong', color: 'bg-green-500', width: '100%' };
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
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Start tracking your job search</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} />
              {password && (
                <div className="mt-1 space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{strength.label}</p>
                </div>
              )}
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
