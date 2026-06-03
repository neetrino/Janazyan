'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@shop/ui';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useTranslation } from '../../../lib/i18n-client';
import { FaqAdminPanel } from './FaqAdminPanel';

export default function FaqAdminPage() {
  const { t } = useTranslation();
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || !isAdmin)) {
      router.push('/supersudo');
    }
  }, [isLoggedIn, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-600">{t('admin.common.loading')}</p>
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  return (
    <Card className="p-6">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">{t('admin.faq.title')}</h1>
      <p className="mb-6 text-sm text-gray-600">{t('admin.faq.subtitle')}</p>
      <FaqAdminPanel />
    </Card>
  );
}
