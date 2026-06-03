'use client';

import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { getDirectionsUrl } from '../get-directions-url';
import type { PartnerStore, StoreSelectHandler } from '../types';

type PartnerStoreCardProps = {
  store: PartnerStore;
  isSelected: boolean;
  getDirectionsLabel: string;
  viewOnMapLabel: string;
  onSelect: StoreSelectHandler;
  compact?: boolean;
  /** Non-interactive labels for carousel side cards (avoids nested controls). */
  previewOnly?: boolean;
};

type StoreLogoProps = {
  store: PartnerStore;
  compact: boolean;
};

function StoreLogo({ store, compact }: StoreLogoProps) {
  const boxClassName = compact
    ? 'partner-store-card-logo partner-store-card-logo--compact flex h-11 w-[4.5rem] shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 px-2 py-1.5'
    : 'flex h-16 w-28 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 px-3 py-2';
  const imageClassName = compact
    ? 'h-8 w-auto max-w-full object-contain'
    : 'h-10 w-auto max-w-full object-contain';

  return (
    <div className={boxClassName}>
      <Image
        src={store.logo}
        alt={store.logoAlt}
        width={112}
        height={48}
        className={imageClassName}
      />
    </div>
  );
}

type StoreCardBodyProps = {
  store: PartnerStore;
  compact: boolean;
};

function StoreCardBody({ store, compact }: StoreCardBodyProps) {
  const titleClassName = compact
    ? 'min-w-0 flex-1 text-sm font-semibold leading-snug text-gray-900 line-clamp-2'
    : 'font-semibold text-gray-900 text-lg';
  const addressRowClassName = compact
    ? 'flex items-start gap-1.5 text-xs leading-snug text-gray-600'
    : 'mt-2 flex items-start gap-2 text-sm leading-relaxed text-gray-600';
  const mapPinClassName = compact
    ? 'mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7CB342]'
    : 'mt-0.5 h-4 w-4 shrink-0 text-[#7CB342]';

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <StoreLogo store={store} compact />
          <h3 className={titleClassName}>{store.name}</h3>
        </div>
        <div className={addressRowClassName}>
          <MapPin className={mapPinClassName} aria-hidden />
          <p className="min-w-0 break-words">{store.address}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4">
      <StoreLogo store={store} compact={false} />
      <div className="min-w-0 flex-1">
        <h3 className={titleClassName}>{store.name}</h3>
        <div className={addressRowClassName}>
          <MapPin className={mapPinClassName} aria-hidden />
          <p>{store.address}</p>
        </div>
      </div>
    </div>
  );
}

type StoreCardActionsProps = {
  store: PartnerStore;
  compact: boolean;
  isSelected: boolean;
  viewOnMapLabel: string;
  getDirectionsLabel: string;
  onSelect: StoreSelectHandler;
  previewOnly: boolean;
};

function StoreCardActions({
  store,
  compact,
  isSelected,
  viewOnMapLabel,
  getDirectionsLabel,
  onSelect,
  previewOnly,
}: StoreCardActionsProps) {
  const actionsClassName = compact
    ? 'relative z-[1] mt-2.5 flex flex-col gap-1.5'
    : 'mt-4 flex flex-wrap gap-2';
  const primaryButtonClassName = compact
    ? 'w-full rounded-lg px-2.5 py-1.5 text-center text-[11px] font-medium leading-tight transition-colors'
    : 'rounded-xl px-4 py-2 text-sm font-medium transition-colors';
  const secondaryLinkClassName = compact
    ? 'w-full rounded-lg border border-gray-300 px-2.5 py-1.5 text-center text-[11px] font-medium leading-tight text-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-50'
    : 'rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-50';

  if (previewOnly) {
    return (
      <div className={actionsClassName} aria-hidden>
        <span className={`${primaryButtonClassName} bg-gray-100 text-gray-800`}>
          {viewOnMapLabel}
        </span>
        <span className={`${secondaryLinkClassName} pointer-events-none`}>
          {getDirectionsLabel}
        </span>
      </div>
    );
  }

  return (
    <div className={actionsClassName}>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onSelect(store.id, { scrollToMap: true });
        }}
        className={`${primaryButtonClassName} ${
          isSelected
            ? 'bg-[#7CB342] text-white shadow-sm'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        {viewOnMapLabel}
      </button>
      <a
        href={getDirectionsUrl(store.lat, store.lng)}
        target="_blank"
        rel="noopener noreferrer"
        className={secondaryLinkClassName}
      >
        {getDirectionsLabel}
      </a>
    </div>
  );
}

/**
 * Partner store card with logo, address, and map/directions actions.
 */
export function PartnerStoreCard({
  store,
  isSelected,
  getDirectionsLabel,
  viewOnMapLabel,
  onSelect,
  compact = false,
  previewOnly = false,
}: PartnerStoreCardProps) {
  const articleClassName = [
    'group rounded-2xl border bg-white transition-all duration-200',
    compact ? 'p-3' : 'p-5',
    isSelected
      ? 'border-[#7CB342] shadow-md ring-2 ring-[#7CB342]/20'
      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm',
  ].join(' ');

  return (
    <article className={articleClassName}>
      <StoreCardBody store={store} compact={compact} />
      <StoreCardActions
        store={store}
        compact={compact}
        isSelected={isSelected}
        viewOnMapLabel={viewOnMapLabel}
        getDirectionsLabel={getDirectionsLabel}
        onSelect={onSelect}
        previewOnly={previewOnly}
      />
    </article>
  );
}
