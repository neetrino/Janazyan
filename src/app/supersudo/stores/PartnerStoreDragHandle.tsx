'use client';

import type { DragEvent } from 'react';

type PartnerStoreDragHandleProps = {
  disabled?: boolean;
  label: string;
  itemId: string;
  onDragStart: (event: DragEvent<HTMLButtonElement>) => void;
  onDragEnd: () => void;
};

export function PartnerStoreDragHandle({
  disabled = false,
  label,
  itemId,
  onDragStart,
  onDragEnd,
}: PartnerStoreDragHandleProps) {
  return (
    <button
      type="button"
      draggable={!disabled}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', itemId);
        onDragStart(event);
      }}
      onDragEnd={onDragEnd}
      disabled={disabled}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded text-gray-400 ${
        disabled
          ? 'cursor-not-allowed opacity-40'
          : 'cursor-grab hover:bg-gray-100 hover:text-gray-600 active:cursor-grabbing'
      }`}
      aria-label={label}
      title={label}
    >
      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
        <circle cx="5" cy="4" r="1.2" />
        <circle cx="11" cy="4" r="1.2" />
        <circle cx="5" cy="8" r="1.2" />
        <circle cx="11" cy="8" r="1.2" />
        <circle cx="5" cy="12" r="1.2" />
        <circle cx="11" cy="12" r="1.2" />
      </svg>
    </button>
  );
}
