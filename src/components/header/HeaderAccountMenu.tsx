'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-hooks';

const HEADER_ACTION_BUTTON_SIZE_PX = 40;
/** Figma node I45:562;42:243 — filled cyan profile button. */
const HEADER_PROFILE_BG = '#0499c3';
const DROPDOWN_GAP_PX = 8;
const DROPDOWN_Z_INDEX = 100;

const LOGIN_PATH = '/login';
const PROFILE_PATH = '/profile';
const ADMIN_PATH = '/supersudo';

type AccountMenuEntry =
  | { kind: 'link'; href: string; labelKey: string }
  | { kind: 'logout'; labelKey: string };

type DropdownPosition = {
  top: number;
  right: number;
};

function buildLoggedInMenuEntries(isAdmin: boolean): AccountMenuEntry[] {
  const profileItem: AccountMenuEntry = {
    kind: 'link',
    href: PROFILE_PATH,
    labelKey: 'common.navigation.profile',
  };
  const adminItem: AccountMenuEntry = {
    kind: 'link',
    href: ADMIN_PATH,
    labelKey: 'common.navigation.admin',
  };
  const logoutItem: AccountMenuEntry = {
    kind: 'logout',
    labelKey: 'common.navigation.logout',
  };

  if (isAdmin) {
    return [adminItem, profileItem, logoutItem];
  }

  return [logoutItem, profileItem];
}

function buildGuestMenuEntries(loginHref: string): AccountMenuEntry[] {
  return [
    {
      kind: 'link',
      href: loginHref,
      labelKey: 'common.navigation.login',
    },
  ];
}

function useDropdownPosition(
  triggerRef: React.RefObject<HTMLDivElement | null>,
  isOpen: boolean,
): DropdownPosition | null {
  const [position, setPosition] = useState<DropdownPosition | null>(null);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    setPosition({
      top: rect.bottom + DROPDOWN_GAP_PX,
      right: window.innerWidth - rect.right,
    });
  }, [triggerRef]);

  useEffect(() => {
    if (!isOpen) {
      setPosition(null);
      return;
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  return position;
}

export function HeaderAccountMenu() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const { t } = useTranslation();
  const pathname = usePathname();
  const menuId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dropdownPosition = useDropdownPosition(triggerRef, isOpen);

  const loginHref = `${LOGIN_PATH}?redirect=${encodeURIComponent(pathname || '/')}`;
  const menuEntries = isLoggedIn
    ? buildLoggedInMenuEntries(isAdmin)
    : buildGuestMenuEntries(loginHref);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      closeMenu();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeMenu]);

  const handleToggle = () => {
    setIsOpen((open) => !open);
  };

  const dropdownPanel =
    isOpen && dropdownPosition ? (
      <div
        id={menuId}
        ref={panelRef}
        role="menu"
        className="fixed min-w-[10.5rem] overflow-hidden rounded-xl border border-gray-200/90 bg-white py-1 shadow-lg"
        style={{
          top: dropdownPosition.top,
          right: dropdownPosition.right,
          zIndex: DROPDOWN_Z_INDEX,
        }}
      >
        {menuEntries.map((entry) => {
          if (entry.kind === 'link') {
            return (
              <Link
                key={entry.href}
                href={entry.href}
                role="menuitem"
                onClick={closeMenu}
                className="block px-4 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-gray-50"
              >
                {t(entry.labelKey)}
              </Link>
            );
          }

          return (
            <button
              key="logout"
              type="button"
              role="menuitem"
              onClick={() => {
                closeMenu();
                logout();
              }}
              className="block w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              {t(entry.labelKey)}
            </button>
          );
        })}
      </div>
    ) : null;

  return (
    <div className="relative" ref={triggerRef}>
      <button
        type="button"
        onClick={handleToggle}
        aria-label={t('common.navigation.profile')}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        className="grid place-items-center rounded-full transition-opacity hover:opacity-80"
        style={{
          width: HEADER_ACTION_BUTTON_SIZE_PX,
          height: HEADER_ACTION_BUTTON_SIZE_PX,
          backgroundColor: HEADER_PROFILE_BG,
        }}
      >
        <User className="pointer-events-none h-[22px] w-[22px] text-white" strokeWidth={2} />
      </button>

      {isMounted && dropdownPanel ? createPortal(dropdownPanel, document.body) : null}
    </div>
  );
}
