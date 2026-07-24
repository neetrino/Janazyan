'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, Home } from 'lucide-react';
import { UserAvatar } from '../../components/UserAvatar';
import {
  PROFILE_MOBILE_CARD_CLASS,
  PROFILE_MOBILE_OUTER_CLASS,
} from '../../lib/layout/account-pages-layout.constants';
import { STOREFRONT_DESKTOP_MIN_WIDTH_PX } from '../../lib/layout/storefront-layout.constants';
import {
  PROFILE_DELETE_MOBILE_ROW_CLASS,
  PROFILE_DELETE_MOBILE_ROW_ICON_CLASS,
  PROFILE_DELETE_MOBILE_ROW_LABEL_CLASS,
  PROFILE_MOBILE_CHEVRON_CLASS,
  PROFILE_MOBILE_MENU_SURFACE_CLASS,
  PROFILE_MOBILE_ROW_CLASS,
  PROFILE_MOBILE_ROW_ICON_CLASS,
  PROFILE_MOBILE_ROW_LABEL_CLASS,
  PROFILE_MOBILE_SHEET_OVERLAY_Z_CLASS,
} from './profile-layout.constants';
import type { ProfileTab, ProfileTabConfig, UserProfile } from './types';

interface ProfileMobilePageProps {
  profile: UserProfile | null;
  tabs: ProfileTabConfig[];
  activeTab: ProfileTab;
  onTabSelect: (_tab: ProfileTab) => void;
  onLogout: () => void;
  t: (_key: string) => string;
  isSheetOpen: boolean;
  onCloseSheet: () => void;
  children: ReactNode;
}

function getDisplayName(profile: UserProfile | null, t: (_key: string) => string): string {
  if (profile?.firstName && profile?.lastName) {
    return `${profile.firstName} ${profile.lastName}`;
  }
  return profile?.firstName || profile?.lastName || t('profile.myProfile');
}

function ProfileMobileSheet({
  activeTabLabel,
  onCloseSheet,
  t,
  children,
}: {
  activeTabLabel: string;
  onCloseSheet: () => void;
  t: (_key: string) => string;
  children: ReactNode;
}) {
  return (
    <div
      className={`fixed inset-0 ${PROFILE_MOBILE_SHEET_OVERLAY_Z_CLASS} flex flex-col bg-cream/95 desktop:hidden`}
      role="dialog"
      aria-modal="true"
      aria-label={activeTabLabel}
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-sky-mist/50 px-4 pb-3 pt-[max(env(safe-area-inset-top,0px),0.75rem)] sm:px-5">
        <button
          type="button"
          onClick={onCloseSheet}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sky-mist/70 bg-white text-ink-700 shadow-sm"
          aria-label={t('common.navigation.back')}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>
        <h2 className="min-w-0 flex-1 text-lg font-semibold text-ink-800">{activeTabLabel}</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 pb-[calc(88px+env(safe-area-inset-bottom,0px))] sm:px-4">
        {children}
      </div>
    </div>
  );
}

export function ProfileMobilePage({
  profile,
  tabs,
  activeTab,
  onTabSelect,
  onLogout,
  t,
  isSheetOpen,
  onCloseSheet,
  children,
}: ProfileMobilePageProps) {
  const [isMounted, setIsMounted] = useState(false);
  const displayName = getDisplayName(profile, t);
  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label ?? t('profile.myProfile');
  const dashboardTab = tabs.find((tab) => tab.id === 'dashboard');
  const passwordTab = tabs.find((tab) => tab.id === 'password');
  const otherTabs = tabs.filter((tab) => tab.id !== 'dashboard' && tab.id !== 'password');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isSheetOpen) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      return;
    }

    const mediaQuery = window.matchMedia(
      `(max-width: ${STOREFRONT_DESKTOP_MIN_WIDTH_PX - 1}px)`,
    );
    if (!mediaQuery.matches) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      return;
    }

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [isSheetOpen]);

  const sheet =
    isSheetOpen ? (
      <ProfileMobileSheet activeTabLabel={activeTabLabel} onCloseSheet={onCloseSheet} t={t}>
        {children}
      </ProfileMobileSheet>
    ) : null;

  return (
    <div className={PROFILE_MOBILE_OUTER_CLASS}>
      <div className={PROFILE_MOBILE_CARD_CLASS}>
        <div className="mb-5 flex items-center gap-4">
          <UserAvatar
            firstName={profile?.firstName}
            lastName={profile?.lastName}
            avatarUrl={profile?.avatarUrl || profile?.avatar || profile?.imageUrl || profile?.image || null}
            size="lg"
            className="h-20 w-20 text-xl ring-2 ring-sky/30"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xl font-semibold text-ink-800">{displayName}</p>
            {profile?.email && <p className="truncate text-sm text-ink-500">{profile.email}</p>}
          </div>
        </div>

        <div className={PROFILE_MOBILE_MENU_SURFACE_CLASS}>
          {dashboardTab && (
            <button type="button" onClick={() => onTabSelect(dashboardTab.id)} className={PROFILE_MOBILE_ROW_CLASS}>
              <span className={PROFILE_MOBILE_ROW_LABEL_CLASS}>
                <span className={PROFILE_MOBILE_ROW_ICON_CLASS}>
                  <Home className="h-5 w-5" strokeWidth={1.75} />
                </span>
                {dashboardTab.label}
              </span>
            </button>
          )}
          {otherTabs
            .filter((tab) => tab.id !== 'deleteAccount')
            .map((tab) => (
              <button key={tab.id} type="button" onClick={() => onTabSelect(tab.id)} className={PROFILE_MOBILE_ROW_CLASS}>
                <span className={PROFILE_MOBILE_ROW_LABEL_CLASS}>
                  <span className={PROFILE_MOBILE_ROW_ICON_CLASS}>{tab.icon}</span>
                  {tab.label}
                </span>
                <svg className={PROFILE_MOBILE_CHEVRON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          {passwordTab && (
            <button type="button" onClick={() => onTabSelect(passwordTab.id)} className={PROFILE_MOBILE_ROW_CLASS}>
              <span className={PROFILE_MOBILE_ROW_LABEL_CLASS}>
                <span className={PROFILE_MOBILE_ROW_ICON_CLASS}>{passwordTab.icon}</span>
                {passwordTab.label}
              </span>
              <svg className={PROFILE_MOBILE_CHEVRON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          {otherTabs
            .filter((tab) => tab.id === 'deleteAccount')
            .map((tab) => (
              <button key={tab.id} type="button" onClick={() => onTabSelect(tab.id)} className={PROFILE_DELETE_MOBILE_ROW_CLASS}>
                <span className={PROFILE_DELETE_MOBILE_ROW_LABEL_CLASS}>
                  <span className={PROFILE_DELETE_MOBILE_ROW_ICON_CLASS}>{tab.icon}</span>
                  {tab.label}
                </span>
                <svg className={`${PROFILE_MOBILE_CHEVRON_CLASS} text-sale`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          <button type="button" onClick={onLogout} className={PROFILE_DELETE_MOBILE_ROW_CLASS}>
            <span className="text-base font-semibold">{t('common.navigation.logout')}</span>
            <svg className="h-5 w-5 text-sale" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {!isSheetOpen && activeTab === 'dashboard' ? (
        <div className="mt-4 px-1 pb-[calc(88px+env(safe-area-inset-bottom,0px))]">{children}</div>
      ) : null}

      {isMounted && sheet ? createPortal(sheet, document.body) : null}
    </div>
  );
}
