'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye } from 'lucide-react';
import {
  LOGIN_CHECKBOX_SQUARE_ICON_SRC,
  LOGIN_FORM_ACTIONS_CLASS,
  LOGIN_FORM_CARD_CLASS,
  LOGIN_FORM_FIELD_GROUP_CLASS,
  LOGIN_FORM_FIELDS_CLASS,
  LOGIN_FORM_INPUT_CLASS,
  LOGIN_FORM_INPUT_SHELL_CLASS,
  LOGIN_FORM_LABEL_CLASS,
  LOGIN_FORM_OPTIONS_ROW_CLASS,
  LOGIN_FORM_STACK_CLASS,
  LOGIN_FORGOT_LINK_CLASS,
  LOGIN_INPUT_EYE_OFF_ICON_SRC,
  LOGIN_INPUT_LOCK_ICON_SRC,
  LOGIN_INPUT_MAIL_ICON_SRC,
  LOGIN_REMEMBER_ROW_CLASS,
  LOGIN_REMEMBER_TEXT_CLASS,
  LOGIN_SIGNUP_FOOTER_CLASS,
  LOGIN_SIGNUP_LINK_CLASS,
  LOGIN_SUBMIT_BUTTON_CLASS,
} from '../login-page.constants';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useTranslation } from '../../../lib/i18n-client';
import { resolveLoginApiError } from '../../../lib/auth/client-api-error-messages';
import { logger } from '@/lib/utils/logger';

/** Login form card — Figma node 505:809. */
export function LoginFormSection() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || '/';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    logger.debug('🔐 [LOGIN PAGE] Form submitted');

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
    } catch (err: unknown) {
      console.error('❌ [LOGIN PAGE] Login error:', err);
      setError(resolveLoginApiError(err instanceof Error ? err.message : String(err), t));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || isLoading;

  return (
    <div className={LOGIN_FORM_CARD_CLASS}>
      {error ? (
        <div
          className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className={LOGIN_FORM_STACK_CLASS}>
        <div className={LOGIN_FORM_FIELDS_CLASS}>
          <div className={LOGIN_FORM_FIELD_GROUP_CLASS}>
            <label htmlFor="login-email" className={LOGIN_FORM_LABEL_CLASS}>
              {t('login.form.email')}
            </label>
            <div className={LOGIN_FORM_INPUT_SHELL_CLASS}>
              <Image
                src={LOGIN_INPUT_MAIL_ICON_SRC}
                alt=""
                aria-hidden
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder={t('login.form.emailPlaceholder')}
                className={LOGIN_FORM_INPUT_CLASS}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isDisabled}
                required
              />
            </div>
          </div>

          <div className={LOGIN_FORM_FIELD_GROUP_CLASS}>
            <label htmlFor="login-password" className={LOGIN_FORM_LABEL_CLASS}>
              {t('login.form.password')}
            </label>
            <div className={LOGIN_FORM_INPUT_SHELL_CLASS}>
              <Image
                src={LOGIN_INPUT_LOCK_ICON_SRC}
                alt=""
                aria-hidden
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder={t('login.form.passwordPlaceholder')}
                className={LOGIN_FORM_INPUT_CLASS}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isDisabled}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="flex size-6 shrink-0 items-center justify-center text-[#232323] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={showPassword ? t('login.form.hidePassword') : t('login.form.showPassword')}
                disabled={isDisabled}
              >
                {showPassword ? (
                  <Eye className="size-6" strokeWidth={1.75} />
                ) : (
                  <Image
                    src={LOGIN_INPUT_EYE_OFF_ICON_SRC}
                    alt=""
                    aria-hidden
                    width={24}
                    height={24}
                    className="size-6"
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className={LOGIN_FORM_ACTIONS_CLASS}>
          <button type="submit" className={LOGIN_SUBMIT_BUTTON_CLASS} disabled={isDisabled}>
            {isSubmitting || isLoading ? t('login.form.submitting') : t('login.form.submit')}
          </button>

          <div className={LOGIN_FORM_OPTIONS_ROW_CLASS}>
            <label className={LOGIN_REMEMBER_ROW_CLASS}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="peer sr-only"
                disabled={isDisabled}
              />
              <Image
                src={LOGIN_CHECKBOX_SQUARE_ICON_SRC}
                alt=""
                aria-hidden
                width={24}
                height={24}
                className="size-6 shrink-0 peer-checked:hidden"
              />
              <span className="hidden size-6 shrink-0 items-center justify-center rounded-md bg-sky-deep peer-checked:flex">
                <svg
                  aria-hidden
                  viewBox="0 0 12 10"
                  className="size-3 text-white"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5.25L4.25 8.5L11 1.75"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className={LOGIN_REMEMBER_TEXT_CLASS}>{t('login.form.rememberMe')}</span>
            </label>

            <Link href="/forgot-password" className={LOGIN_FORGOT_LINK_CLASS}>
              {t('login.form.forgotPassword')}
            </Link>
          </div>
        </div>
      </form>

      <p className={LOGIN_SIGNUP_FOOTER_CLASS}>
        {t('login.form.noAccount')}{' '}
        <Link href="/register" className={LOGIN_SIGNUP_LINK_CLASS}>
          {t('login.form.signUp')}
        </Link>
      </p>
    </div>
  );
}
