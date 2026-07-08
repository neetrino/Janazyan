import { UserAvatar } from '../../components/UserAvatar';
import type { UserProfile, ProfileTab, ProfileTabConfig } from './types';
import {
  PROFILE_CONTACT_CHIP_CLASS,
  PROFILE_DELETE_TAB_ACTIVE_DESKTOP_CLASS,
  PROFILE_DELETE_TAB_ACTIVE_MOBILE_CLASS,
  PROFILE_DELETE_TAB_ICON_CLASS,
  PROFILE_DELETE_TAB_INACTIVE_DESKTOP_CLASS,
  PROFILE_DELETE_TAB_INACTIVE_MOBILE_CLASS,
  PROFILE_LOGOUT_BUTTON_CLASS,
  PROFILE_LOGOUT_ICON_CLASS,
  PROFILE_SIDEBAR_IDENTITY_PANEL_CLASS,
  PROFILE_SIDEBAR_NAV_PANEL_CLASS,
  PROFILE_SIDEBAR_SURFACE_CLASS,
  PROFILE_TAB_ACTIVE_DESKTOP_CLASS,
  PROFILE_TAB_ACTIVE_MOBILE_CLASS,
  PROFILE_TAB_ICON_ACTIVE_CLASS,
  PROFILE_TAB_ICON_INACTIVE_CLASS,
  PROFILE_TAB_INACTIVE_DESKTOP_CLASS,
  PROFILE_TAB_INACTIVE_MOBILE_CLASS,
} from './profile-layout.constants';

interface ProfileHeaderProps {
  profile: UserProfile | null;
  tabs: ProfileTabConfig[];
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  onLogout: () => void;
  t: (key: string) => string;
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden={true}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden={true}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function ProfileUserIdentity({
  profile,
  displayName,
}: {
  profile: UserProfile | null;
  displayName: string;
}) {
  const hasSplitName = Boolean(profile?.firstName && profile?.lastName);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-4 text-center sm:gap-4">
        <div className="flex shrink-0 justify-center">
          <UserAvatar
            firstName={profile?.firstName}
            lastName={profile?.lastName}
            avatarUrl={profile?.avatarUrl || profile?.avatar || profile?.imageUrl || profile?.image || null}
            size="md"
            className="shadow-md ring-2 ring-sky/30 sm:h-[4.5rem] sm:w-[4.5rem] sm:text-xl"
          />
        </div>
        <div className="min-w-0 max-w-full space-y-0.5 px-1">
          {hasSplitName ? (
            <div className="space-y-0.5">
              <p className="text-[1.0625rem] font-semibold leading-snug tracking-tight text-ink-800 sm:text-lg">
                {profile?.firstName}
              </p>
              <p className="text-xs font-semibold tracking-wide text-ink-500 sm:text-[0.8125rem]">
                {profile?.lastName}
              </p>
            </div>
          ) : (
            <h1 className="break-words text-lg font-semibold leading-snug tracking-tight text-ink-800 sm:text-xl">
              {displayName}
            </h1>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        {profile?.email && (
          <div className={PROFILE_CONTACT_CHIP_CLASS}>
            <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-sky-deep" />
            <p className="min-w-0 break-words text-xs font-medium leading-relaxed text-ink-700 sm:text-sm">{profile.email}</p>
          </div>
        )}
        {profile?.phone && (
          <div className={`${PROFILE_CONTACT_CHIP_CLASS} items-center`}>
            <PhoneIcon className="h-4 w-4 shrink-0 text-sky-deep" />
            <p className="min-w-0 text-xs font-medium tabular-nums tracking-wide text-ink-700 sm:text-sm">{profile.phone}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileTabNav({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: ProfileTabConfig[];
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}) {
  return (
    <nav
      className="grid grid-cols-2 gap-2 sm:flex sm:flex-col sm:gap-0.5"
      role="tablist"
      aria-label="Profile sections"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isDeleteTab = tab.id === 'deleteAccount';
        const base =
          'flex w-full rounded-md font-medium transition-colors max-sm:min-h-[5.5rem] max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:gap-1.5 max-sm:px-2 max-sm:py-2.5 max-sm:text-center max-sm:text-[11px] max-sm:leading-snug sm:flex-row sm:items-center sm:gap-3 sm:px-3 sm:py-2 sm:text-left sm:text-sm';

        const activeMobile = isDeleteTab
          ? PROFILE_DELETE_TAB_ACTIVE_MOBILE_CLASS
          : PROFILE_TAB_ACTIVE_MOBILE_CLASS;
        const inactiveMobile = isDeleteTab
          ? PROFILE_DELETE_TAB_INACTIVE_MOBILE_CLASS
          : PROFILE_TAB_INACTIVE_MOBILE_CLASS;
        const activeDesktop = isDeleteTab
          ? PROFILE_DELETE_TAB_ACTIVE_DESKTOP_CLASS
          : PROFILE_TAB_ACTIVE_DESKTOP_CLASS;
        const inactiveDesktop = isDeleteTab
          ? PROFILE_DELETE_TAB_INACTIVE_DESKTOP_CLASS
          : PROFILE_TAB_INACTIVE_DESKTOP_CLASS;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`${base} ${isActive ? `${activeMobile} ${activeDesktop}` : `${inactiveMobile} ${inactiveDesktop}`}`}
          >
            <span
              className={`flex shrink-0 items-center justify-center rounded-md max-sm:h-9 max-sm:w-9 sm:h-8 sm:w-8 ${
                isDeleteTab
                  ? PROFILE_DELETE_TAB_ICON_CLASS
                  : isActive
                    ? PROFILE_TAB_ICON_ACTIVE_CLASS
                    : PROFILE_TAB_ICON_INACTIVE_CLASS
              }`}
            >
              <span className="[&>svg]:h-[18px] [&>svg]:w-[18px] sm:[&>svg]:h-4 sm:[&>svg]:w-4">{tab.icon}</span>
            </span>
            <span className="min-w-0 max-sm:line-clamp-3 sm:flex-1 sm:leading-snug">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function ProfileHeader({ profile, tabs, activeTab, onTabChange, onLogout, t }: ProfileHeaderProps) {
  const displayName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile?.firstName
        ? profile.firstName
        : profile?.lastName
          ? profile.lastName
          : t('profile.myProfile');

  return (
    <div className={PROFILE_SIDEBAR_SURFACE_CLASS} aria-label="Profile navigation">
      <div className={PROFILE_SIDEBAR_IDENTITY_PANEL_CLASS}>
        <ProfileUserIdentity profile={profile} displayName={displayName} />
      </div>
      <div className={PROFILE_SIDEBAR_NAV_PANEL_CLASS}>
        <ProfileTabNav tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
        <div className="mt-2 border-t border-sky-mist/50 pt-2">
          <button type="button" onClick={onLogout} className={PROFILE_LOGOUT_BUTTON_CLASS}>
            <span className={PROFILE_LOGOUT_ICON_CLASS}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
            </span>
            <span className="min-w-0 flex-1 leading-snug">{t('common.navigation.logout')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
