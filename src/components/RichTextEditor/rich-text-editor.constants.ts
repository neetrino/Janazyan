/** Minimum height of the editable surface (matches ~6 textarea rows). */
export const RICH_TEXT_EDITOR_MIN_HEIGHT_CLASS = 'min-h-[160px]';

export type RichTextCommand =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikeThrough'
  | 'insertUnorderedList'
  | 'insertOrderedList'
  | 'formatBlock';

export interface RichTextToolbarAction {
  command: RichTextCommand;
  label: string;
  /** Passed as the value argument to document.execCommand when set. */
  value?: string;
  /** Visible glyph / short label in the toolbar button. */
  icon: string;
}

export const RICH_TEXT_TOOLBAR_ACTIONS: readonly RichTextToolbarAction[] = [
  { command: 'bold', label: 'Bold', icon: 'B' },
  { command: 'italic', label: 'Italic', icon: 'I' },
  { command: 'underline', label: 'Underline', icon: 'U' },
  { command: 'strikeThrough', label: 'Strikethrough', icon: 'S' },
  { command: 'insertUnorderedList', label: 'Bullet list', icon: '•' },
  { command: 'insertOrderedList', label: 'Numbered list', icon: '1.' },
  { command: 'formatBlock', label: 'Paragraph', icon: 'P', value: 'p' },
] as const;
