'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type FormEvent, type ReactNode } from 'react';
import { Eye } from 'lucide-react';
import {
  REGISTER_CHECKBOX_SQUARE_ICON_SRC,
  REGISTER_FORM_ACTIONS_CLASS,
  REGISTER_FORM_CARD_CLASS,
  REGISTER_FORM_FIELD_GROUP_CLASS,
  REGISTER_FORM_FIELDS_CLASS,
  REGISTER_FORM_INPUT_CLASS,
  REGISTER_FORM_INPUT_SHELL_CLASS,
  REGISTER_FORM_LABEL_CLASS,
  REGISTER_FORM_STACK_CLASS,
  REGISTER_INPUT_EYE_OFF_ICON_SRC,
  REGISTER_INPUT_LOCK_ICON_SRC,
  REGISTER_INPUT_MAIL_ICON_SRC,
  REGISTER_NAME_ROW_CLASS,
  REGISTER_PASSWORD_HINT_CLASS,
  REGISTER_SIGNIN_FOOTER_CLASS,
  REGISTER_SIGNIN_LINK_CLASS,
  REGISTER_SUBMIT_BUTTON_CLASS,
  REGISTER_TERMS_LINK_CLASS,
  REGISTER_TERMS_ROW_CLASS,
  REGISTER_TERMS_TEXT_CLASS,
} from '../register-page.constants';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useTranslation } from '../../../lib/i18n-client';
import { resolveRegisterApiError } from '../../../lib/auth/client-api-error-messages';
import { logger } from '@/lib/utils/logger';

function RegisterPlainInput({
  id,
  type,
  autoComplete,
  placeholder,
  value,
  onChange,
  disabled,
  required,
}: {
  id: string;
  type: string;
  autoComplete?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  required?: boolean;
}) {
  return (
    <div className={REGISTER_FORM_INPUT_SHELL_CLASS}>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={REGISTER_FORM_INPUT_CLASS}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        required={required}
      />
    </div>
  );
}

function RegisterIconInput({
  id,
  type,
  autoComplete,
  iconSrc,
  placeholder,
  value,
  onChange,
  disabled,
  required,
  trailingAction,
}: {
  id: string;
  type: string;
  autoComplete?: string;
  iconSrc: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  required?: boolean;
  trailingAction?: ReactNode;
}) {
  return (
    <div className={REGISTER_FORM_INPUT_SHELL_CLASS}>
      <Image src={iconSrc} alt="" aria-hidden width={24} height={24} className="size-6 shrink-0" />
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={REGISTER_FORM_INPUT_CLASS}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        required={required}
      />
      {trailingAction}
    </div>
  );
}

/** Register form card — matches login Figma form styling. */
export function RegisterFormSection() {
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
  const isDisabled = isSubmitting || isLoading;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    logger.debug('🔐 [REGISTER PAGE] Form submitted');

    if (!acceptTerms) {
      setError(t('register.errors.acceptTerms'));
      setIsSubmitting(false);
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setError(t('register.errors.emailOrPhoneRequired'));
      setIsSubmitting(false);
      return;
    }

    if (!password) {
      setError(t('register.errors.passwordRequired'));
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError(t('register.errors.passwordMinLength'));
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t('register.errors.passwordsDoNotMatch'));
      setIsSubmitting(false);
      return;
    }

    try {
      await register({
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        password,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });

      setTimeout(() => {
        if (window.location.pathname === '/register') {
          window.location.href = '/';
        }
      }, 1000);
    } catch (err: unknown) {
      console.error('❌ [REGISTER PAGE] Registration error:', err);
      setError(resolveRegisterApiError(err instanceof Error ? err.message : String(err), t));
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordToggle = (visible: boolean, onToggle: () => void, labelShow: string, labelHide: string) => (
    <button
      type="button"
      onClick={onToggle}
      className="flex size-6 shrink-0 items-center justify-center text-[#232323] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={visible ? labelHide : labelShow}
      disabled={isDisabled}
    >
      {visible ? (
        <Eye className="size-6" strokeWidth={1.75} />
      ) : (
        <Image src={REGISTER_INPUT_EYE_OFF_ICON_SRC} alt="" aria-hidden width={24} height={24} className="size-6" />
      )}
    </button>
  );

  return (
    <div className={REGISTER_FORM_CARD_CLASS}>
      {error ? (
        <div
          className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className={REGISTER_FORM_STACK_CLASS}>
        <div className={REGISTER_FORM_FIELDS_CLASS}>
          <div className={REGISTER_NAME_ROW_CLASS}>
            <div className={REGISTER_FORM_FIELD_GROUP_CLASS}>
              <label htmlFor="register-first-name" className={REGISTER_FORM_LABEL_CLASS}>
                {t('register.form.firstName')}
              </label>
              <RegisterPlainInput
                id="register-first-name"
                type="text"
                autoComplete="given-name"
                placeholder={t('register.placeholders.firstName')}
                value={firstName}
                onChange={setFirstName}
                disabled={isDisabled}
                required
              />
            </div>
            <div className={REGISTER_FORM_FIELD_GROUP_CLASS}>
              <label htmlFor="register-last-name" className={REGISTER_FORM_LABEL_CLASS}>
                {t('register.form.lastName')}
              </label>
              <RegisterPlainInput
                id="register-last-name"
                type="text"
                autoComplete="family-name"
                placeholder={t('register.placeholders.lastName')}
                value={lastName}
                onChange={setLastName}
                disabled={isDisabled}
                required
              />
            </div>
          </div>

          <div className={REGISTER_FORM_FIELD_GROUP_CLASS}>
            <label htmlFor="register-email" className={REGISTER_FORM_LABEL_CLASS}>
              {t('register.form.email')}
            </label>
            <RegisterIconInput
              id="register-email"
              type="email"
              autoComplete="email"
              iconSrc={REGISTER_INPUT_MAIL_ICON_SRC}
              placeholder={t('register.placeholders.email')}
              value={email}
              onChange={setEmail}
              disabled={isDisabled}
              required
            />
          </div>

          <div className={REGISTER_FORM_FIELD_GROUP_CLASS}>
            <label htmlFor="register-phone" className={REGISTER_FORM_LABEL_CLASS}>
              {t('register.form.phone')}
            </label>
            <RegisterPlainInput
              id="register-phone"
              type="tel"
              autoComplete="tel"
              placeholder={t('register.placeholders.phone')}
              value={phone}
              onChange={setPhone}
              disabled={isDisabled}
            />
          </div>

          <div className={REGISTER_FORM_FIELD_GROUP_CLASS}>
            <label htmlFor="register-password" className={REGISTER_FORM_LABEL_CLASS}>
              {t('register.form.password')}
            </label>
            <RegisterIconInput
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              iconSrc={REGISTER_INPUT_LOCK_ICON_SRC}
              placeholder={t('register.placeholders.password')}
              value={password}
              onChange={setPassword}
              disabled={isDisabled}
              required
              trailingAction={passwordToggle(
                showPassword,
                () => setShowPassword((current) => !current),
                t('register.form.showPassword'),
                t('register.form.hidePassword'),
              )}
            />
            <p className={REGISTER_PASSWORD_HINT_CLASS}>{t('register.passwordHint')}</p>
          </div>

          <div className={REGISTER_FORM_FIELD_GROUP_CLASS}>
            <label htmlFor="register-confirm-password" className={REGISTER_FORM_LABEL_CLASS}>
              {t('register.form.confirmPassword')}
            </label>
            <RegisterIconInput
              id="register-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              iconSrc={REGISTER_INPUT_LOCK_ICON_SRC}
              placeholder={t('register.placeholders.confirmPassword')}
              value={confirmPassword}
              onChange={setConfirmPassword}
              disabled={isDisabled}
              required
              trailingAction={passwordToggle(
                showConfirmPassword,
                () => setShowConfirmPassword((current) => !current),
                t('register.form.showPassword'),
                t('register.form.hidePassword'),
              )}
            />
          </div>
        </div>

        <div className={REGISTER_FORM_ACTIONS_CLASS}>
          <label className={`${REGISTER_TERMS_ROW_CLASS} items-start`}>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(event) => {
                setAcceptTerms(event.target.checked);
                if (event.target.checked && error === t('register.errors.acceptTerms')) {
                  setError(null);
                }
              }}
              className="peer sr-only"
              disabled={isDisabled}
              required
            />
            <Image
              src={REGISTER_CHECKBOX_SQUARE_ICON_SRC}
              alt=""
              aria-hidden
              width={24}
              height={24}
              className="mt-0.5 size-6 shrink-0 peer-checked:hidden"
            />
            <span className="mt-0.5 hidden size-6 shrink-0 items-center justify-center rounded-md bg-sky-deep peer-checked:flex">
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
            <span className={REGISTER_TERMS_TEXT_CLASS}>
              {t('register.form.acceptTerms')}{' '}
              <Link href="/terms" className={REGISTER_TERMS_LINK_CLASS}>
                {t('register.form.termsOfService')}
              </Link>{' '}
              {t('register.form.and')}{' '}
              <Link href="/privacy" className={REGISTER_TERMS_LINK_CLASS}>
                {t('register.form.privacyPolicy')}
              </Link>
            </span>
          </label>

          <button type="submit" className={REGISTER_SUBMIT_BUTTON_CLASS} disabled={isDisabled}>
            {isSubmitting || isLoading ? t('register.form.creatingAccount') : t('register.form.createAccount')}
          </button>
        </div>
      </form>

      <p className={REGISTER_SIGNIN_FOOTER_CLASS}>
        {t('register.form.alreadyHaveAccount')}{' '}
        <Link href="/login" className={REGISTER_SIGNIN_LINK_CLASS}>
          {t('register.form.signIn')}
        </Link>
      </p>
    </div>
  );
}
