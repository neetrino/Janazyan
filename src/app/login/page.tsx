'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Input } from '@shop/ui';
import Link from 'next/link';
import { AuthGlassCard } from '../../components/auth/AuthGlassCard';
import { AuthPageShell } from '../../components/auth/AuthPageShell';
import {
  AUTH_GLASS_ERROR_CLASS,
  AUTH_GLASS_INPUT_CLASS,
} from '../../components/auth/auth-glass-styles';
import { useAuth } from '../../lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../../lib/i18n-client';
import { resolveLoginApiError } from '../../lib/auth/client-api-error-messages';
import { Eye, EyeOff } from 'lucide-react';
import { logger } from "@/lib/utils/logger";

function LoginPageContent() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isLoading, isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || '/';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    logger.debug('🔐 [LOGIN PAGE] Form submitted');

    // Validation
    if (!email.trim()) {
      setError(t('login.errors.emailRequired'));
      setIsSubmitting(false);
      return;
    }

    if (!password) {
      setError(t('login.errors.passwordRequired'));
      setIsSubmitting(false);
      return;
    }

    try {
      logger.debug('📤 [LOGIN PAGE] Calling login function...');
      const loggedInUser = await login(email.trim(), password);
      const isUserAdmin =
        Array.isArray(loggedInUser.roles) && loggedInUser.roles.includes('admin');
      const destination = isUserAdmin ? '/supersudo' : redirectTo;
      logger.debug('✅ [LOGIN PAGE] Login successful, redirecting to:', destination);
      router.push(destination);
    } catch (err: any) {
      console.error('❌ [LOGIN PAGE] Login error:', err);
      setError(resolveLoginApiError(err instanceof Error ? err.message : String(err), t));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if already logged in (admins go to admin panel)
  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      router.push(isAdmin ? '/supersudo' : redirectTo);
    }
  }, [isLoggedIn, isLoading, isAdmin, redirectTo, router]);

  return (
    <AuthPageShell>
      <AuthGlassCard>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('login.title')}</h1>
        <p className="text-gray-600 mb-8">{t('login.subtitle')}</p>

        {error && (
          <div className={`mb-4 p-3 ${AUTH_GLASS_ERROR_CLASS}`}>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t('login.form.email')}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={t('login.form.emailPlaceholder')}
              className={`w-full ${AUTH_GLASS_INPUT_CLASS}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || isLoading}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {t('login.form.password')}
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('login.form.passwordPlaceholder')}
                className={`w-full pr-10 ${AUTH_GLASS_INPUT_CLASS}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting || isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                disabled={isSubmitting || isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isSubmitting || isLoading}
              />
              <span className="ml-2 text-sm text-gray-600">{t('login.form.rememberMe')}</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              {t('login.form.forgotPassword')}
            </Link>
          </div>
          <Button 
            variant="primary" 
            className="w-full"
            type="submit"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? t('login.form.submitting') : t('login.form.submit')}
          </Button>
        </form>

        <div className="relative z-20 mt-6 text-center text-sm text-gray-600">
          {t('login.form.noAccount')}{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:underline">
            {t('login.form.signUp')}
          </Link>
        </div>
      </AuthGlassCard>
    </AuthPageShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <AuthPageShell>
        <AuthGlassCard>
          <div className="animate-pulse">
            <div className="h-8 bg-white/40 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-white/40 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-10 bg-white/40 rounded-xl"></div>
              <div className="h-10 bg-white/40 rounded-xl"></div>
              <div className="h-10 bg-white/40 rounded-xl"></div>
            </div>
          </div>
        </AuthGlassCard>
      </AuthPageShell>
    }>
      <LoginPageContent />
    </Suspense>
  );
}

