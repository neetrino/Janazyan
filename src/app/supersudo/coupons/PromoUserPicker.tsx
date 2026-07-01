'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { logger } from '@/lib/utils/logger';

export type PromoUserOption = {
  id: string;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  roles: string[];
};

type UsersListResponse = { data: PromoUserOption[] };

type UserRoleFilter = '' | 'admin' | 'customer';

type PromoUserPickerProps = {
  open: boolean;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
  labels: {
    title: string;
    allUsers: string;
    selectedCount: string;
    search: string;
    roleAll: string;
    roleAdmin: string;
    roleCustomer: string;
    loading: string;
    empty: string;
    loadError: string;
  };
};

const INPUT_CLASS =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300';

function formatUserLabel(user: PromoUserOption): string {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  if (name) {
    return name;
  }
  return user.email ?? user.phone ?? user.id;
}

function formatUserSecondary(user: PromoUserOption): string | null {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  if (name && user.email) {
    return user.email;
  }
  if (user.phone && user.email !== user.phone) {
    return user.phone;
  }
  return null;
}

export function PromoUserPicker({
  open,
  selectedIds,
  onChange,
  disabled = false,
  labels,
}: PromoUserPickerProps) {
  const [expanded, setExpanded] = useState(false);
  const [users, setUsers] = useState<PromoUserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    try {
      const res = await apiClient.get<UsersListResponse>('/api/v1/admin/users', {
        params: {
          role: roleFilter,
          search: search.trim(),
        },
      });
      setUsers(res.data ?? []);
    } catch (err) {
      logger.error('[ADMIN COUPONS] load users failed', { err });
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, search]);

  useEffect(() => {
    if (!open) {
      setExpanded(false);
      setSearch('');
      setRoleFilter('');
      setUsers([]);
    }
  }, [open]);

  useEffect(() => {
    if (!expanded) {
      return;
    }
    const timer = window.setTimeout(() => {
      void loadUsers();
    }, search ? 300 : 0);
    return () => window.clearTimeout(timer);
  }, [expanded, loadUsers, search, roleFilter]);

  const subtitle =
    selectedIds.length === 0
      ? labels.allUsers
      : labels.selectedCount.replace('{count}', String(selectedIds.length));

  const toggleUser = (userId: string) => {
    if (disabled) {
      return;
    }
    onChange(
      selectedIds.includes(userId)
        ? selectedIds.filter((id) => id !== userId)
        : [...selectedIds, userId],
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        disabled={disabled}
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">{labels.title}</p>
          <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
        </div>
        <span
          className={`shrink-0 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {expanded ? (
        <div className="border-t border-gray-200 px-4 pb-4 pt-3">
          <div className="mb-3 grid grid-cols-2 gap-3">
            <input
              type="search"
              className={INPUT_CLASS}
              placeholder={labels.search}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              disabled={disabled}
            />
            <select
              className={INPUT_CLASS}
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value as UserRoleFilter)
              }
              disabled={disabled}
            >
              <option value="">{labels.roleAll}</option>
              <option value="customer">{labels.roleCustomer}</option>
              <option value="admin">{labels.roleAdmin}</option>
            </select>
          </div>

          {loading ? (
            <p className="py-2 text-sm text-gray-500">{labels.loading}</p>
          ) : null}

          {loadFailed ? (
            <p className="py-2 text-sm text-red-600">{labels.loadError}</p>
          ) : null}

          {!loading && !loadFailed ? (
            <ul className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto">
              {users.length === 0 ? (
                <li className="col-span-2 py-2 text-sm text-gray-500">{labels.empty}</li>
              ) : (
                users.map((user) => {
                  const checked = selectedIds.includes(user.id);
                  const secondary = formatUserSecondary(user);
                  return (
                    <li key={user.id} className="min-w-0">
                      <label className="flex h-full cursor-pointer items-start gap-2 rounded-lg px-2 py-2 hover:bg-white">
                        <input
                          type="checkbox"
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-gray-900 focus:ring-gray-400"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => toggleUser(user.id)}
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-gray-900">
                            {formatUserLabel(user)}
                          </span>
                          {secondary ? (
                            <span className="block truncate text-xs text-gray-500">{secondary}</span>
                          ) : null}
                        </span>
                      </label>
                    </li>
                  );
                })
              )}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
