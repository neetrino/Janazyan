'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useTranslation } from '../../lib/i18n-client';
import { FOOTER_COMPANY } from './constants';
import { buildFooterSidebarHref } from './footer-sidebar-href';
import { FOOTER_LINK, FooterColumn } from './FooterShared';
import { useFooterSidebarQuery } from './useFooterSidebarQuery';

type FooterCompanyLinksProps = {
  title: string;
  className?: string;
  listClassName?: string;
};

function FooterCompanyLinksContent({
  title,
  className = '',
  listClassName,
}: FooterCompanyLinksProps) {
  const { t } = useTranslation();
  const query = useFooterSidebarQuery();

  return (
    <FooterColumn title={title} className={className} listClassName={listClassName}>
      {FOOTER_COMPANY.map((link) => (
        <li key={link.href}>
          <Link href={buildFooterSidebarHref(link.href, query)} className={FOOTER_LINK}>
            {t('common.footer.' + link.labelKey)}
          </Link>
        </li>
      ))}
    </FooterColumn>
  );
}

export function FooterCompanyLinks(props: FooterCompanyLinksProps) {
  return (
    <Suspense fallback={null}>
      <FooterCompanyLinksContent {...props} />
    </Suspense>
  );
}
