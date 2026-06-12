import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthShell } from '@/components/layout/AuthShell';
import { Wordmark } from '@/components/Wordmark';
import type { User } from '@/types';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export function Login() {
  const { isAuthenticated, setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  // Detected synchronously so we never flash the form during an OAuth callback.
  const oauthToken = new URLSearchParams(location.search).get('token');
  const [oauthFailed, setOauthFailed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  // Handle Google OAuth callback token
  useEffect(() => {
    if (!oauthToken) return;
    let active = true;
    api
      .get('/auth/me', { headers: { Authorization: `Bearer ${oauthToken}` } })
      .then(({ data }) => {
        if (!active) return;
        setAuth(data.user as User, oauthToken);
        navigate('/', { replace: true });
      })
      .catch(() => {
        if (active) setOauthFailed(true);
      });
    return () => {
      active = false;
    };
  }, [oauthToken, setAuth, navigate]);

  async function onSubmit(data: FormData) {
    try {
      const res = await api.post<{ accessToken: string; user: User }>('/auth/login', data);
      setAuth(res.data.user, res.data.accessToken);
    } catch {
      setError('root', { message: 'Invalid email or password' });
    }
  }

  const googleUrl = `${import.meta.env.VITE_API_URL || '/api'}/auth/google`;

  // While exchanging the OAuth token (or already authenticated), show a loader
  // instead of the login form so it never flashes on the way to the dashboard.
  if ((oauthToken && !oauthFailed) || isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
        <Wordmark />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing you in…
        </div>
      </div>
    );
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue your job search">
      {oauthFailed && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Google sign-in failed. Please try again.
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        {errors.root && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errors.root.message}
          </div>
        )}
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <a href={googleUrl}>
        <Button variant="outline" size="lg" className="w-full gap-2">
          <GoogleIcon />
          Continue with Google
        </Button>
      </a>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account?{' '}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
