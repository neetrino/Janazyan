import type { HTMLAttributes, ReactNode } from 'react';
import { AUTH_GLASS_CARD_PADDING_CLASS } from './auth-layout.constants';
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
    <div
      className={`w-full ${AUTH_GLASS_CARD_CLASS} ${AUTH_GLASS_CARD_PADDING_CLASS} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
