'use client';

import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { getDirectionsUrl } from '../get-directions-url';
import type { PartnerStore } from '../types';

type PartnerStoreCardProps = {
  store: PartnerStore;
  isSelected: boolean;
  getDirectionsLabel: string;
  viewOnMapLabel: string;
  onSelect: (storeId: string) => void;
  compact?: boolean;
};

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
}: PartnerStoreCardProps) {
  return (
    <article
      className={`group rounded-2xl border bg-white transition-all duration-200 ${
        compact ? 'p-3.5' : 'p-5'
      } ${
        isSelected
          ? 'border-[#7CB342] shadow-md ring-2 ring-[#7CB342]/20'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className={`flex items-start ${compact ? 'gap-3' : 'gap-4'}`}>
        <div
          className={`flex shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 ${
            compact ? 'h-14 w-24' : 'h-16 w-28'
          }`}
        >
          <Image
            src={store.logo}
            alt={store.logoAlt}
            width={112}
            height={48}
            className={`w-auto max-w-full object-contain ${compact ? 'h-9' : 'h-10'}`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className={`font-semibold text-gray-900 ${compact ? 'text-base' : 'text-lg'}`}>
            {store.name}
          </h3>
          <div
            className={`mt-2 flex items-start gap-2 leading-relaxed text-gray-600 ${
              compact ? 'text-xs' : 'text-sm'
            }`}
          >
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#7CB342]" aria-hidden />
            <p>{store.address}</p>
          </div>
        </div>
      </div>

      <div className={`flex flex-wrap gap-2 ${compact ? 'mt-3' : 'mt-4'}`}>
        <button
          type="button"
          onClick={() => onSelect(store.id)}
          className={`rounded-xl font-medium transition-colors ${
            compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
          } ${
            isSelected
              ? 'bg-[#7CB342] text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {viewOnMapLabel}
        </button>
        <a
          href={getDirectionsUrl(store.lat, store.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-xl border border-gray-300 font-medium text-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-50 ${
            compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
          }`}
        >
          {getDirectionsLabel}
        </a>
      </div>
    </article>
  );
}
