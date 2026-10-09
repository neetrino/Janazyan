'use client';

import {
  RICH_TEXT_TOOLBAR_ACTIONS,
  type RichTextCommand,
} from './rich-text-editor.constants';

interface RichTextToolbarProps {
  onCommand: (command: RichTextCommand, value?: string) => void;
  disabled?: boolean;
}

function buttonClassName(command: RichTextCommand): string {
  const base =
    'inline-flex h-8 min-w-8 items-center justify-center rounded border border-gray-300 bg-white px-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50';
  if (command === 'bold') return `${base} font-bold`;
  if (command === 'italic') return `${base} italic`;
  if (command === 'underline') return `${base} underline`;
  if (command === 'strikeThrough') return `${base} line-through`;
  return base;
}

export function RichTextToolbar({ onCommand, disabled = false }: RichTextToolbarProps) {
  return (
    <div
      className="flex flex-wrap gap-1 border-b border-gray-300 bg-gray-50 px-2 py-1.5"
      role="toolbar"
      aria-label="Text formatting"
    >
      {RICH_TEXT_TOOLBAR_ACTIONS.map((action) => (
        <button
          key={`${action.command}-${action.value ?? ''}`}
          type="button"
          disabled={disabled}
          title={action.label}
          aria-label={action.label}
          className={buttonClassName(action.command)}
          onMouseDown={(event) => {
            event.preventDefault();
            onCommand(action.command, action.value);
          }}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}
