'use client';

import Image from 'next/image';
import { MapPin, Store } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { PartnerStore, StoreSelectHandler } from '../types';

type PartnerStoresDirectoryProps = {
  stores: PartnerStore[];
  selectedStoreId: string | null;
  viewOnMapLabel: string;
  onSelect: StoreSelectHandler;
  ariaLabel: string;
  /** When true, list scroll is handled by a parent shell container. */
  embedded?: boolean;
};

type PartnerStoreDirectoryItemProps = {
  store: PartnerStore;
  isSelected: boolean;
  viewOnMapLabel: string;
  onSelect: StoreSelectHandler;
  setItemRef: (storeId: string, node: HTMLButtonElement | null) => void;
};

function buildStoreRowClassName(isSelected: boolean): string {
  return [
    'partner-stores-directory__item',
    isSelected ? 'partner-stores-directory__item--selected' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function PartnerStoreDirectoryItem({
  store,
  isSelected,
  viewOnMapLabel,
  onSelect,
  setItemRef,
}: PartnerStoreDirectoryItemProps) {
  return (
    <div role="listitem">
      <button
        ref={(node) => setItemRef(store.id, node)}
        type="button"
        className={buildStoreRowClassName(isSelected)}
        aria-label={`${viewOnMapLabel}: ${store.name}`}
        aria-pressed={isSelected}
        onClick={() => onSelect(store.id, { scrollToMap: true })}
      >
        <span className="partner-stores-directory__logo" aria-hidden>
          <Image
            src={store.logo}
            alt=""
            width={40}
            height={40}
            className="partner-stores-directory__logo-img"
          />
        </span>
        <span className="partner-stores-directory__content">
          <span className="partner-stores-directory__name">{store.name}</span>
          <span className="partner-stores-directory__address">
            <MapPin className="partner-stores-directory__address-icon" aria-hidden />
            {store.address}
          </span>
        </span>
        <Store className="partner-stores-directory__marker" aria-hidden />
      </button>
    </div>
  );
}

export function PartnerStoresDirectory({
  stores,
  selectedStoreId,
  viewOnMapLabel,
  onSelect,
  ariaLabel,
  embedded = false,
}: PartnerStoresDirectoryProps) {
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const setItemRef = (storeId: string, node: HTMLButtonElement | null) => {
    if (node) {
      itemRefs.current.set(storeId, node);
      return;
    }
    itemRefs.current.delete(storeId);
  };

  useEffect(() => {
    if (!selectedStoreId) {
      return;
    }

    itemRefs.current.get(selectedStoreId)?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [selectedStoreId]);

  if (stores.length === 0) {
    return null;
  }

  return (
    <div className="partner-stores-directory" aria-label={ariaLabel}>
      <div
        className={
          embedded
            ? 'partner-stores-directory__list partner-stores-directory__list--embedded'
            : 'partner-stores-directory__list'
        }
        role="list"
      >
        {stores.map((store) => {
          const isSelected = selectedStoreId === store.id;

          return (
            <PartnerStoreDirectoryItem
              key={store.id}
              store={store}
              isSelected={isSelected}
              viewOnMapLabel={viewOnMapLabel}
              onSelect={onSelect}
              setItemRef={setItemRef}
            />
          );
        })}
      </div>
    </div>
  );
}
