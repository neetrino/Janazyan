'use client';

import { useCallback, useEffect, useId, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  ariaLabel?: string;
  /** Trigger width follows the selected label instead of stretching. */
  fitContent?: boolean;
};

type MenuBox = {
  top: number;
  left: number;
  width: number;
};

const SELECT_MENU_MAX_HEIGHT_CLASS = 'max-h-60';
const SELECT_MENU_GAP_PX = 4;
const SELECT_MENU_Z_INDEX = 10000;

function useCloseOnOutside(
  open: boolean,
  roots: Array<RefObject<HTMLElement | null>>,
  close: () => void,
) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (roots.some((root) => root.current?.contains(target))) {
        return;
      }
      close();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, roots, close]);
}

function useMenuBox(open: boolean, anchor: RefObject<HTMLElement | null>): MenuBox | null {
  const [box, setBox] = useState<MenuBox | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const update = () => {
      const rect = anchor.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }
      setBox({
        top: rect.bottom + SELECT_MENU_GAP_PX,
        left: rect.left,
        width: rect.width,
      });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchor]);

  return open ? box : null;
}

function SelectMenu({
  listId,
  box,
  menuRef,
  options,
  value,
  onChoose,
  fitContent,
}: {
  listId: string;
  box: MenuBox;
  menuRef: RefObject<HTMLUListElement | null>;
  options: SelectOption[];
  value: string;
  onChoose: (value: string) => void;
  fitContent: boolean;
}) {
  return createPortal(
    <ul
      ref={menuRef}
      id={listId}
      role="listbox"
      className={`fixed overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-card ${SELECT_MENU_MAX_HEIGHT_CLASS}`}
      style={{
        top: box.top,
        left: box.left,
        width: fitContent ? 'max-content' : box.width,
        minWidth: box.width,
        zIndex: SELECT_MENU_Z_INDEX,
      }}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <li key={option.value || option.label} role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => onChoose(option.value)}
              className={`w-full px-3 py-2 text-left text-sm ${
                isSelected ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          </li>
        );
      })}
    </ul>,
    document.body,
  );
}

/**
 * Shared dropdown. The menu is portaled so it always paints above drawers and overflow.
 */
export function Select({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className = '',
  id,
  ariaLabel,
  fitContent = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);
  const close = useCallback(() => setOpen(false), []);
  const box = useMenuBox(open, rootRef);
  useCloseOnOutside(open, [rootRef, menuRef], close);

  const choose = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${fitContent ? 'w-max max-w-full' : 'w-full'}`}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
        className={`flex items-center justify-between gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-left text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${fitContent ? 'w-max whitespace-nowrap' : 'w-full'} ${className}`}
      >
        <span className={selected ? '' : 'text-gray-400'}>
          {selected?.label ?? placeholder ?? ''}
        </span>
        <svg className="h-4 w-4 shrink-0 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {box ? (
        <SelectMenu
          listId={listId}
          box={box}
          menuRef={menuRef}
          options={options}
          value={value}
          onChoose={choose}
          fitContent={fitContent}
        />
      ) : null}
    </div>
  );
}
