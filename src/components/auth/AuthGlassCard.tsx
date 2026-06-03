import type { HTMLAttributes, ReactNode } from 'react';
import { AUTH_GLASS_CARD_CLASS } from './auth-glass-styles';

interface AuthGlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/** Frosted-glass card for login and register forms. */
export function AuthGlassCard({
  children,
  className = '',
  ...props
}: AuthGlassCardProps) {
  return (
    <div className={`${AUTH_GLASS_CARD_CLASS} p-8 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
