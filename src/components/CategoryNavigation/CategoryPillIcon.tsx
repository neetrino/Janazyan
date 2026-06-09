import type { ReactElement } from 'react';

const ICON_SIZE = 20;

type IconKind = 'all' | 'face' | 'hair' | 'body' | 'kids' | 'generic';

const KEYWORD_MAP: ReadonlyArray<readonly [IconKind, readonly string[]]> = [
  ['face', ['դեմք', 'face', 'դիմ']],
  ['hair', ['մազ', 'hair']],
  ['body', ['մարմ', 'body']],
  ['kids', ['մանկ', 'երեխ', 'baby', 'kid', 'child']],
];

/** Map a category title/slug to a stable icon kind (Armenian + English keywords). */
function resolveIconKind(title: string, slug: string): IconKind {
  if (slug === 'all') {
    return 'all';
  }
  const haystack = `${title} ${slug}`.toLowerCase();
  for (const [kind, keywords] of KEYWORD_MAP) {
    if (keywords.some((keyword) => haystack.includes(keyword))) {
      return kind;
    }
  }
  return 'generic';
}

const ICONS: Record<IconKind, ReactElement> = {
  all: (
    <g>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </g>
  ),
  face: (
    <g>
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="10" r="0.6" fill="currentColor" />
      <circle cx="15" cy="10" r="0.6" fill="currentColor" />
      <path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8" />
    </g>
  ),
  hair: (
    <g>
      <path d="M5 14c0-4.5 3-8 7-8s7 3.5 7 8" />
      <path d="M5 14c-.5 2.5 0 5 1.5 6.5" />
      <path d="M19 14c.5 2.5 0 5-1.5 6.5" />
      <path d="M12 6V3.5" />
    </g>
  ),
  body: (
    <g>
      <circle cx="12" cy="5" r="2.4" />
      <path d="M12 8v8" />
      <path d="M6 11h12" />
      <path d="M12 16l-3 5" />
      <path d="M12 16l3 5" />
    </g>
  ),
  kids: (
    <g>
      <circle cx="12" cy="8" r="4.5" />
      <circle cx="10" cy="8" r="0.6" fill="currentColor" />
      <circle cx="14" cy="8" r="0.6" fill="currentColor" />
      <path d="M10.5 10c.9.7 2.1.7 3 0" />
      <path d="M7 20v-2.5c0-1.7 1.3-3 3-3h4c1.7 0 3 1.3 3 3V20" />
    </g>
  ),
  generic: (
    <g>
      <path d="M3.5 12.5l8-8c.4-.4.9-.6 1.4-.6H19c.6 0 1 .4 1 1v5.6c0 .5-.2 1-.6 1.4l-8 8c-.6.6-1.5.6-2.1 0l-5.8-5.8c-.6-.6-.6-1.5 0-2.1z" />
      <circle cx="15.5" cy="8.5" r="1.1" fill="currentColor" />
    </g>
  ),
};

type CategoryPillIconProps = {
  title: string;
  slug: string;
};

/**
 * Leading line icon for a category filter pill — inherits `currentColor`
 * so it matches the active (white) / inactive (sky-deep) pill text color.
 */
export function CategoryPillIcon({ title, slug }: CategoryPillIconProps): ReactElement {
  const kind = resolveIconKind(title, slug);

  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden
    >
      {ICONS[kind]}
    </svg>
  );
}
