'use client';

import Image from 'next/image';
import { Map, MapPin } from 'lucide-react';
import {
  PARTNER_STORE_CARD_COMPACT_CLASS,
  PARTNER_STORE_CARD_FULL_CLASS,
  PARTNER_STORE_CARD_SELECTED_CLASS,
  PARTNER_STORE_MAP_CTA_ACTIVE_CLASS,
  PARTNER_STORE_MAP_CTA_CLASS,
} from '../partner-store-card.constants';
import type { PartnerStore, StoreSelectHandler } from '../types';

type PartnerStoreCardProps = {
  store: PartnerStore;
  isSelected: boolean;
  viewOnMapLabel: string;
  onSelect: StoreSelectHandler;
  compact?: boolean;
  /** Non-interactive labels for carousel side cards (avoids nested controls). */
  previewOnly?: boolean;
  /** Omits actions — use with an external `PartnerStoreCardActions` in carousel layouts. */
  hideActions?: boolean;
};

type PartnerStoreCardActionsProps = {
  store: PartnerStore;
  compact: boolean;
  isSelected: boolean;
  viewOnMapLabel: string;
  onSelect: StoreSelectHandler;
  previewOnly: boolean;
  className?: string;
};

function buildCardClassName(compact: boolean, isSelected: boolean): string {
  return [
    'partner-store-card',
    compact ? PARTNER_STORE_CARD_COMPACT_CLASS : PARTNER_STORE_CARD_FULL_CLASS,
    isSelected ? PARTNER_STORE_CARD_SELECTED_CLASS : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function buildMapCtaClassName(isSelected: boolean): string {
  return [
    PARTNER_STORE_MAP_CTA_CLASS,
    isSelected ? PARTNER_STORE_MAP_CTA_ACTIVE_CLASS : '',
  ]
    .filter(Boolean)
    .join(' ');
}

type StoreCardBodyProps = {
  store: PartnerStore;
  compact: boolean;
};

function StoreCardBody({ store, compact }: StoreCardBodyProps) {
  if (compact) {
    return (
      <div className="partner-store-card__body partner-store-card__body--compact">
        <div className="partner-store-card__logo-wrap">
          <Image
            src={store.logo}
            alt={store.logoAlt}
            width={112}
            height={48}
            className="partner-store-card__logo-img"
          />
        </div>
        <h3 className="partner-store-card__title">{store.name}</h3>
        <div className="partner-store-card__address">
          <MapPin className="partner-store-card__address-icon" aria-hidden />
          <p className="partner-store-card__address-text">{store.address}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="partner-store-card__body partner-store-card__body--full">
      <div className="partner-store-card__logo-wrap partner-store-card__logo-wrap--full">
        <Image
          src={store.logo}
          alt={store.logoAlt}
          width={112}
          height={48}
          className="partner-store-card__logo-img partner-store-card__logo-img--full"
        />
      </div>
      <div className="partner-store-card__content">
        <h3 className="partner-store-card__title partner-store-card__title--full">{store.name}</h3>
        <div className="partner-store-card__address partner-store-card__address--full">
          <MapPin className="partner-store-card__address-icon" aria-hidden />
          <p className="partner-store-card__address-text">{store.address}</p>
        </div>
      </div>
    </div>
  );
}

/** View-on-map control for a partner store card. */
export function PartnerStoreCardActions({
  store,
  compact,
  isSelected,
  viewOnMapLabel,
  onSelect,
  previewOnly,
  className = '',
}: PartnerStoreCardActionsProps) {
  const ctaClassName = buildMapCtaClassName(isSelected);
  const wrapperClassName = [
    compact ? 'partner-store-card__actions partner-store-card__actions--compact' : 'partner-store-card__actions',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (previewOnly) {
    return (
      <div className={wrapperClassName} aria-hidden>
        <span className={ctaClassName}>
          <Map className="partner-stores-map-cta__icon" aria-hidden />
          {viewOnMapLabel}
        </span>
      </div>
    );
  }

  return (
    <div
      className={wrapperClassName}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onSelect(store.id, { openMapModal: true });
        }}
        className={ctaClassName}
      >
        <Map className="partner-stores-map-cta__icon" aria-hidden />
        {viewOnMapLabel}
      </button>
    </div>
  );
}

/**
 * Partner store card with logo, address, and map action.
 */
export function PartnerStoreCard({
  store,
  isSelected,
  viewOnMapLabel,
  onSelect,
  compact = false,
  previewOnly = false,
  hideActions = false,
}: PartnerStoreCardProps) {
  return (
    <article className={buildCardClassName(compact, isSelected)}>
      <StoreCardBody store={store} compact={compact} />
      {hideActions ? null : (
        <PartnerStoreCardActions
          store={store}
          compact={compact}
          isSelected={isSelected}
          viewOnMapLabel={viewOnMapLabel}
          onSelect={onSelect}
          previewOnly={previewOnly}
        />
      )}
    </article>
  );
}
