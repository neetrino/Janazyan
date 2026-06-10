import type { ReactNode } from 'react';
import { AUTH_PAGE_SHELL_PADDING_CLASS } from './auth-layout.constants';

interface AuthPageShellProps {
  children: ReactNode;
}

/** Centered auth layout — background comes from {@link ProductsHeroShell} like other storefront pages. */
export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className={`relative w-full ${AUTH_PAGE_SHELL_PADDING_CLASS}`}>
      <div className="w-full sm:mx-auto sm:max-w-lg">{children}</div>
    </div>
  );
}
