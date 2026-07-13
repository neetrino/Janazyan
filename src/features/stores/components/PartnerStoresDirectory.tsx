'use client';

import Image from 'next/image';
import { ChevronDown, MapPin, Store } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { groupPartnerStoresByHierarchy } from '../group-partner-stores';
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

function HierarchyToggle({
  label,
  open,
  onToggle,
  count,
  nested = false,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  count: number;
  nested?: boolean;
}) {
  return (
    <button
      type="button"
      className={[
        'partner-stores-directory__group-toggle',
        nested ? 'partner-stores-directory__group-toggle--nested' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-expanded={open}
      onClick={onToggle}
    >
      <span className="partner-stores-directory__group-leading">
        <ChevronDown
          className={[
            'partner-stores-directory__group-chevron',
            'partner-stores-directory__group-chevron--leading',
            open ? 'partner-stores-directory__group-chevron--open' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden
        />
        <span className="partner-stores-directory__group-label">{label}</span>
      </span>
      <span className="partner-stores-directory__group-meta">
        <span className="partner-stores-directory__group-count">{count}</span>
      </span>
    </button>
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
  const regions = useMemo(() => groupPartnerStoresByHierarchy(stores), [stores]);
  const [openRegionIds, setOpenRegionIds] = useState<Set<string>>(new Set());
  const [openAreaIds, setOpenAreaIds] = useState<Set<string>>(new Set());

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

    const selected = stores.find((store) => store.id === selectedStoreId);
    if (selected) {
      setOpenRegionIds((current) => new Set(current).add(selected.regionId));
      if (selected.areaId) {
        setOpenAreaIds((current) => new Set(current).add(selected.areaId!));
      }
    }

    itemRefs.current.get(selectedStoreId)?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [selectedStoreId, stores]);

  if (stores.length === 0) {
    return null;
  }

  const listClassName = embedded
    ? 'partner-stores-directory__list partner-stores-directory__list--embedded'
    : 'partner-stores-directory__list';

  const toggleRegion = (regionId: string) => {
    setOpenRegionIds((current) => {
      const next = new Set(current);
      if (next.has(regionId)) {
        next.delete(regionId);
      } else {
        next.add(regionId);
      }
      return next;
    });
  };

  const toggleArea = (areaId: string) => {
    setOpenAreaIds((current) => {
      const next = new Set(current);
      if (next.has(areaId)) {
        next.delete(areaId);
      } else {
        next.add(areaId);
      }
      return next;
    });
  };

  return (
    <div className="partner-stores-directory" aria-label={ariaLabel}>
      <div className={listClassName} role="list">
        {regions.map((region) => {
          const regionOpen = openRegionIds.has(region.id);
          const regionStoreCount =
            region.stores.length + region.areas.reduce((sum, area) => sum + area.stores.length, 0);

          return (
            <div key={region.id} className="partner-stores-directory__group" role="listitem">
              <HierarchyToggle
                label={region.name}
                open={regionOpen}
                onToggle={() => toggleRegion(region.id)}
                count={regionStoreCount}
              />
              {regionOpen ? (
                <div className="partner-stores-directory__group-body">
                  {region.areas.map((area) => {
                    const areaOpen = openAreaIds.has(area.id);
                    return (
                      <div key={area.id} className="partner-stores-directory__subgroup">
                        <HierarchyToggle
                          label={area.name}
                          open={areaOpen}
                          onToggle={() => toggleArea(area.id)}
                          count={area.stores.length}
                          nested
                        />
                        {areaOpen
                          ? area.stores.map((store) => (
                              <PartnerStoreDirectoryItem
                                key={store.id}
                                store={store}
                                isSelected={selectedStoreId === store.id}
                                viewOnMapLabel={viewOnMapLabel}
                                onSelect={onSelect}
                                setItemRef={setItemRef}
                              />
                            ))
                          : null}
                      </div>
                    );
                  })}
                  {region.stores.map((store) => (
                    <PartnerStoreDirectoryItem
                      key={store.id}
                      store={store}
                      isSelected={selectedStoreId === store.id}
                      viewOnMapLabel={viewOnMapLabel}
                      onSelect={onSelect}
                      setItemRef={setItemRef}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
