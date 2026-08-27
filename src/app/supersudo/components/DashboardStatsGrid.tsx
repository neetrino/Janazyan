'use client';

import Link from 'next/link';
import {
  ADMIN_CARD_CLASS,
  ADMIN_CARD_HOVER_CLASS,
  ADMIN_CHIP_BUTTER,
  ADMIN_CHIP_CORAL,
} from '../admin-ui-classes';

type DashboardStatsGridProps = {
  users: number;
  products: number;
  usersLabel: string;
  productsLabel: string;
};

function CompactStat({
  href,
  label,
  value,
  iconBg,
  iconColor,
  iconPath,
}: {
  href: string;
  label: string;
  value: string;
  iconBg: string;
  iconColor: string;
  iconPath: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 ${ADMIN_CARD_CLASS} ${ADMIN_CARD_HOVER_CLASS}`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg}`}
      >
        <svg
          className={`h-4 w-4 ${iconColor}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={iconPath}
          />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-lg font-bold leading-tight text-gray-900">{value}</p>
      </div>
    </Link>
  );
}

export function DashboardStatsGrid({
  users,
  products,
  usersLabel,
  productsLabel,
}: DashboardStatsGridProps) {
  return (
    <div className="mb-3 grid grid-cols-2 gap-3">
      <CompactStat
        href="/supersudo/users"
        label={usersLabel}
        value={String(users)}
        iconBg={ADMIN_CHIP_CORAL.bg}
        iconColor={ADMIN_CHIP_CORAL.fg}
        iconPath="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
      <CompactStat
        href="/supersudo/products"
        label={productsLabel}
        value={String(products)}
        iconBg={ADMIN_CHIP_BUTTER.bg}
        iconColor={ADMIN_CHIP_BUTTER.fg}
        iconPath="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </div>
  );
}
