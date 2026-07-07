'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from '../../lib/i18n-client';

interface AccountMobileBackBarProps {
  href: string;
  label?: string;
}

export function AccountMobileBackBar({ href, label }: AccountMobileBackBarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center desktop:hidden">
      <Link
        href={href}
        className="inline-flex min-h-11 items-center gap-0.5 rounded-full border border-sky-mist/80 bg-white py-2 pl-1.5 pr-4 text-sm font-semibold text-ink-800 shadow-[0_4px_14px_rgba(30,41,57,0.1)]"
      >
        <ChevronLeft className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
        {label ?? t('common.navigation.back')}
      </Link>
    </div>
  );
}
