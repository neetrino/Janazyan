import type { ReactNode } from 'react';

interface AuthPageShellProps {
  children: ReactNode;
}

/** Centered auth layout with soft gradient orbs behind glass cards. */
export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="relative overflow-hidden px-4 pb-24 pt-12 sm:px-6 lg:px-8 lg:pb-12">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-12 h-64 w-64 rounded-full bg-[#ecf5ff]/80 blur-3xl" />
        <div className="absolute -right-16 top-1/3 h-72 w-72 rounded-full bg-[#e6cbd5]/70 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-white/60 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-lg">{children}</div>
    </div>
  );
}
