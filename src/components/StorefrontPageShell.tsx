import type { ReactNode } from 'react';

type StorefrontPageShellProps = {
  children: ReactNode;
};

/**
 * Shared backdrop for non-home storefront pages — light blue fading to white near the footer.
 */
export function StorefrontPageShell({ children }: StorefrontPageShellProps) {
  return (
    <div className="relative isolate min-h-full bg-products-catalog">
      <div className="relative z-10 mx-auto w-full max-w-[1475px] pb-12 lg:pb-[220px]">
        {children}
      </div>
    </div>
  );
}
