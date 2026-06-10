'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@shop/ui';
import { STOREFRONT_GLASS_SUBMIT_BUTTON_CLASS } from '../products/[slug]/product-action-bar.constants';
import Link from 'next/link';
import { AuthGlassCard } from '../../components/auth/AuthGlassCard';
import { AuthPageShell } from '../../components/auth/AuthPageShell';
import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import {
  AUTH_GLASS_ERROR_CLASS,
  AUTH_GLASS_INPUT_CLASS,
} from '../../components/auth/auth-glass-styles';
import {
  AUTH_PAGE_MOBILE_CONTENT_INSET_CLASS,
  AUTH_PAGE_MOBILE_CONTENT_SURFACE_CLASS,
} from '../../components/auth/auth-layout.constants';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-client';
import { resolveRegisterApiError } from '../../lib/auth/client-api-error-messages';
import { Eye, EyeOff } from 'lucide-react';
import { logger } from "@/lib/utils/logger";

export default function RegisterPage() {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    logger.debug('🔐 [REGISTER PAGE] Form submitted');

    // Validation - check in order of importance
    logger.debug('🔍 [REGISTER PAGE] Validating form data...');
    logger.debug('🔍 [REGISTER PAGE] Form state:', {
      email: email.trim() || 'empty',
      phone: phone.trim() || 'empty',
      hasPassword: !!password,
      passwordLength: password.length,
      passwordsMatch: password === confirmPassword,
      acceptTerms,
    });

    if (!acceptTerms) {
      logger.debug('❌ [REGISTER PAGE] Validation failed: Terms not accepted');
      setError(t('register.errors.acceptTerms'));
      setIsSubmitting(false);
      return;
    }

    if (!email.trim() && !phone.trim()) {
      logger.debug('❌ [REGISTER PAGE] Validation failed: No email or phone');
      setError(t('register.errors.emailOrPhoneRequired'));
      setIsSubmitting(false);
      return;
    }

    if (!password) {
      logger.debug('❌ [REGISTER PAGE] Validation failed: No password');
      setError(t('register.errors.passwordRequired'));
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      logger.debug('❌ [REGISTER PAGE] Validation failed: Password too short');
      setError(t('register.errors.passwordMinLength'));
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      logger.debug('❌ [REGISTER PAGE] Validation failed: Passwords do not match');
      setError(t('register.errors.passwordsDoNotMatch'));
      setIsSubmitting(false);
      return;
    }

    logger.debug('✅ [REGISTER PAGE] All validations passed');

    try {
      logger.debug('📤 [REGISTER PAGE] Calling register function...');
      logger.debug('📤 [REGISTER PAGE] Registration data:', {
        email: email.trim() || 'not provided',
        phone: phone.trim() || 'not provided',
        hasPassword: !!password,
        firstName: firstName.trim() || 'not provided',
        lastName: lastName.trim() || 'not provided',
      });
      
      await register({
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        password,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });
      
      logger.debug('✅ [REGISTER PAGE] Registration successful, redirecting...');
      // Redirect is handled by AuthContext
      // But we can also redirect here as a fallback
      setTimeout(() => {
        if (window.location.pathname === '/register') {
          logger.debug('🔄 [REGISTER PAGE] Fallback redirect to home...');
          window.location.href = '/';
        }
      }, 1000);
    } catch (err: any) {
      console.error('❌ [REGISTER PAGE] Registration error:', err);
      console.error('❌ [REGISTER PAGE] Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      setError(resolveRegisterApiError(err instanceof Error ? err.message : String(err), t));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProductsHeroShell
      sectionAriaLabel="Register"
      mobileContentSurfaceClassName={AUTH_PAGE_MOBILE_CONTENT_SURFACE_CLASS}
      mobileContentInsetClassName={AUTH_PAGE_MOBILE_CONTENT_INSET_CLASS}
      catalog={
        <AuthPageShell>
          <AuthGlassCard>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('register.title')}</h1>
        <p className="text-gray-600 mb-8">{t('register.subtitle')}</p>

        {error && (
          <div className={`mb-4 p-3 ${AUTH_GLASS_ERROR_CLASS}`}>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('register.form.firstName')}
                <span className="ml-0.5 text-red-500">*</span>
              </label>
              <Input
                id="firstName"
                type="text"
                placeholder={t('register.placeholders.firstName')}
                className={`w-full ${AUTH_GLASS_INPUT_CLASS}`}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isSubmitting || isLoading}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('register.form.lastName')}
                <span className="ml-0.5 text-red-500">*</span>
              </label>
              <Input
                id="lastName"
                type="text"
                placeholder={t('register.placeholders.lastName')}
                className={`w-full ${AUTH_GLASS_INPUT_CLASS}`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isSubmitting || isLoading}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t('register.form.email')}
              <span className="ml-0.5 text-red-500">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder={t('register.placeholders.email')}
              className={`w-full ${AUTH_GLASS_INPUT_CLASS}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || isLoading}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              {t('register.form.phone')}
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder={t('register.placeholders.phone')}
              className={`w-full ${AUTH_GLASS_INPUT_CLASS}`}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting || isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {t('register.form.password')}
              <span className="ml-0.5 text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('register.placeholders.password')}
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
            <p className="mt-1 text-xs text-gray-500">
              {t('register.passwordHint')}
            </p>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              {t('register.form.confirmPassword')}
              <span className="ml-0.5 text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder={t('register.placeholders.confirmPassword')}
                className={`w-full pr-10 ${AUTH_GLASS_INPUT_CLASS}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting || isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                disabled={isSubmitting || isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                // Clear error when checkbox is checked
                if (e.target.checked && error === t('register.errors.acceptTerms')) {
                  setError(null);
                }
              }}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={isSubmitting || isLoading}
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              {t('register.form.acceptTerms')}{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                {t('register.form.termsOfService')}
              </Link>{' '}
              {t('register.form.and')}{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                {t('register.form.privacyPolicy')}
              </Link>
            </label>
          </div>
          {!acceptTerms && error === t('register.errors.acceptTerms') && (
            <p className="text-xs text-red-600 -mt-2">{t('register.errors.mustAcceptTerms')}</p>
          )}
          <button
            type="submit"
            className={STOREFRONT_GLASS_SUBMIT_BUTTON_CLASS}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? t('register.form.creatingAccount') : t('register.form.createAccount')}
          </button>
        </form>

        <div className="relative z-20 mt-6 text-center text-sm text-gray-600">
          {t('register.form.alreadyHaveAccount')}{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            {t('register.form.signIn')}
          </Link>
        </div>
          </AuthGlassCard>
        </AuthPageShell>
      }
    />
  );
}

