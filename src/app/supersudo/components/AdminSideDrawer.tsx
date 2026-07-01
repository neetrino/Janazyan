'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '../../../lib/i18n-client';

export const ADMIN_SIDE_DRAWER_ANIMATION_MS = 420;

const ADMIN_SIDE_DRAWER_EASE_CLASS = 'ease-[cubic-bezier(0.32,0.72,0,1)]';

const ADMIN_SIDE_DRAWER_WIDTH_CLASS = {
  md: 'w-full max-w-lg shrink-0',
  lg: 'w-full max-w-2xl shrink-0',
  xl: 'w-full max-w-4xl shrink-0',
  panel: 'w-[60%] shrink-0',
  wide: 'w-1/2 shrink-0',
} as const;

interface AdminSideDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  side?: 'left' | 'right';
  size?: keyof typeof ADMIN_SIDE_DRAWER_WIDTH_CLASS;
  children: ReactNode;
  footer?: ReactNode;
}

/** Full-height admin panel that slides in from the left or right. */
export function AdminSideDrawer({
  open,
  onClose,
  title,
  subtitle,
  side = 'left',
  size = 'md',
  children,
  footer,
}: AdminSideDrawerProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setSlideIn(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setSlideIn(false);
    const timer = window.setTimeout(() => setMounted(false), ADMIN_SIDE_DRAWER_ANIMATION_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  if (!mounted) {
    return null;
  }

  const hiddenTranslateClass = side === 'left' ? '-translate-x-full' : 'translate-x-full';
  const containerAlignClass = side === 'left' ? 'justify-start' : 'justify-end';

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex ${containerAlignClass} transition-opacity duration-[420ms] ${ADMIN_SIDE_DRAWER_EASE_CLASS} ${
        slideIn ? 'bg-black/40' : 'bg-black/0'
      }`}
      onClick={onClose}
      role="presentation"
    >
      <aside
        className={`flex h-full ${ADMIN_SIDE_DRAWER_WIDTH_CLASS[size]} flex-col bg-white shadow-2xl transition-transform duration-[420ms] ${ADMIN_SIDE_DRAWER_EASE_CLASS} ${
          slideIn ? 'translate-x-0' : hiddenTranslateClass
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-side-drawer-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
          <div className="min-w-0">
            <h2 id="admin-side-drawer-title" className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            aria-label={t('admin.common.close')}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer ? (
          <footer className="shrink-0 border-t border-gray-200 px-6 py-4">{footer}</footer>
        ) : null}
      </aside>
    </div>,
    document.body,
  );
}

export function AdminFormSectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{children}</p>
  );
}
