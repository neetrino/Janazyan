'use client';

import { Button, Card } from '@shop/ui';
import type { PromoCodeAdminRow } from '@/lib/promo-codes/types';
import {
  ADMIN_TABLE,
  ADMIN_TABLE_CARD,
  ADMIN_TABLE_OUTER_SCROLL,
  ADMIN_TABLE_TBODY,
  ADMIN_TABLE_TD,
  ADMIN_TABLE_TH,
  ADMIN_TABLE_THEAD,
} from '../constants/admin-table-classes';

export type PromoCodesAdminTableProps = {
  rows: PromoCodeAdminRow[];
  emptyText: string;
  labels: Record<string, string>;
  onEdit: (row: PromoCodeAdminRow) => void;
  onCopy: (code: string) => void;
  onDelete: (row: PromoCodeAdminRow) => void;
};

function formatShortDate(iso: string | null): string {
  if (!iso) {
    return '—';
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '—';
  }
  return d.toLocaleString();
}

export function PromoCodesAdminTable({
  rows,
  emptyText,
  labels,
  onEdit,
  onCopy,
  onDelete,
}: PromoCodesAdminTableProps) {
  if (rows.length === 0) {
    return (
      <Card className={ADMIN_TABLE_CARD}>
        <div className="p-8 text-center text-gray-500">{emptyText}</div>
      </Card>
    );
  }

  return (
    <Card className={ADMIN_TABLE_CARD}>
      <div className={ADMIN_TABLE_OUTER_SCROLL}>
        <table className={ADMIN_TABLE}>
          <thead className={ADMIN_TABLE_THEAD}>
            <tr>
              <th className={ADMIN_TABLE_TH}>{labels.tableCode}</th>
              <th className={ADMIN_TABLE_TH}>{labels.tableType}</th>
              <th className={ADMIN_TABLE_TH}>{labels.tableValue}</th>
              <th className={ADMIN_TABLE_TH}>{labels.tableUsage}</th>
              <th className={ADMIN_TABLE_TH}>{labels.tableUsed}</th>
              <th className={ADMIN_TABLE_TH}>{labels.tableActive}</th>
              <th className={ADMIN_TABLE_TH}>{labels.tableValid}</th>
              <th className={ADMIN_TABLE_TH}>{labels.tableActions}</th>
            </tr>
          </thead>
          <tbody className={ADMIN_TABLE_TBODY}>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className={ADMIN_TABLE_TD}>
                  <span className="font-mono font-medium">{row.code}</span>
                </td>
                <td className={ADMIN_TABLE_TD}>
                  {row.discountType === 'percent' ? labels.typePercent : labels.typeFixed}
                </td>
                <td className={ADMIN_TABLE_TD}>
                  {row.discountType === 'percent' ? `${row.discountValue}%` : String(row.discountValue)}
                </td>
                <td className={ADMIN_TABLE_TD}>{row.usageLimit ?? '—'}</td>
                <td className={ADMIN_TABLE_TD}>{row.usedCount}</td>
                <td className={ADMIN_TABLE_TD}>{row.active ? '✓' : '—'}</td>
                <td className={ADMIN_TABLE_TD}>{formatShortDate(row.validUntil)}</td>
                <td className={ADMIN_TABLE_TD}>
                  <div className="flex flex-wrap items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      aria-label={labels.edit}
                      title={labels.edit}
                      onClick={() => onEdit(row)}
                    >
                      <svg
                        className="h-5 w-5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      aria-label={labels.copy}
                      title={labels.copy}
                      onClick={() => onCopy(row.code)}
                    >
                      <svg
                        className="h-5 w-5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <rect x="8" y="8" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M6 14V6a2 2 0 0 1 2-2h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      aria-label={labels.delete}
                      title={labels.delete}
                      onClick={() => onDelete(row)}
                    >
                      <svg
                        className="h-5 w-5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
