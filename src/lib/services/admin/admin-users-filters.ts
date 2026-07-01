export type AdminUsersListFilters = {
  role?: '' | 'admin' | 'customer';
  search?: string;
};

export function parseAdminUsersListFilters(raw: unknown): AdminUsersListFilters {
  if (typeof raw !== 'object' || raw === null) {
    return {};
  }
  const input = raw as Record<string, unknown>;
  const roleRaw = typeof input.role === 'string' ? input.role.trim().toLowerCase() : '';
  const role =
    roleRaw === 'admin' || roleRaw === 'customer' ? roleRaw : ('' as const);
  const search = typeof input.search === 'string' ? input.search.trim() : '';
  return { role, search };
}
