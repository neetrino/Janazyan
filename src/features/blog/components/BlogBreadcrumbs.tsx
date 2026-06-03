import Link from 'next/link';

type BlogBreadcrumbsProps = {
  homeLabel: string;
  currentLabel: string;
};

export function BlogBreadcrumbs({ homeLabel, currentLabel }: BlogBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="transition-colors hover:text-gray-900">
            {homeLabel}
          </Link>
        </li>
        <li aria-hidden className="text-gray-400">
          /
        </li>
        <li className="font-medium text-gray-900" aria-current="page">
          {currentLabel}
        </li>
      </ol>
    </nav>
  );
}
