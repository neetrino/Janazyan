'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@shop/ui';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useTranslation } from '../../../lib/i18n-client';
import { BlogPostsSection } from './BlogPostsSection';

export default function BlogAdminPage() {
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
      <p className="mb-4 text-sm text-gray-600">{t('admin.blog.subtitle')}</p>
      <BlogPostsSection />
    </Card>
  );
}
