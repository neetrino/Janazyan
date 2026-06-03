import Link from 'next/link';
import { useTranslation } from '../../../lib/i18n-client';

export function BlogBreadcrumbs() {
  const { t } = useTranslation();

  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="transition-colors hover:text-gray-900">
            {t('blog.breadcrumbHome')}
          </Link>
        </li>
        <li aria-hidden className="text-gray-400">
          /
        </li>
        <li className="font-medium text-gray-900" aria-current="page">
          {t('blog.breadcrumbCurrent')}
        </li>
      </ol>
    </nav>
  );
}
