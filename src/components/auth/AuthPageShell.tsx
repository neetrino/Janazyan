import type { ReactNode } from 'react';

interface AuthPageShellProps {
  children: ReactNode;
}

/** Centered auth layout — background comes from {@link ProductsHeroShell} like other storefront pages. */
export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="relative px-4 pb-24 pt-12 sm:px-6 lg:px-8 lg:pb-12">
      <div className="mx-auto max-w-lg">{children}</div>
    </div>
  );
}
