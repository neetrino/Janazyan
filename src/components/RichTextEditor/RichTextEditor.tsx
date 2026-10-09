'use client';

import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { normalizeRichTextHtml } from '../../lib/utils/normalize-rich-text-html';
import { sanitizeHtml } from '../../lib/utils/sanitize';
import { RichTextToolbar } from './RichTextToolbar';
import {
  RICH_TEXT_EDITOR_MIN_HEIGHT_CLASS,
  type RichTextCommand,
} from './rich-text-editor.constants';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

function isEmptyEditorHtml(html: string): boolean {
  const trimmed = html.trim();
  return (
    !trimmed ||
    trimmed === '<br>' ||
    trimmed === '<div><br></div>' ||
    trimmed === '<p><br></p>' ||
    trimmed === '<p></p>'
  );
}

function prepareHtmlForPersist(rawHtml: string): string {
  if (isEmptyEditorHtml(rawHtml)) {
    return '';
  }
  return sanitizeHtml(normalizeRichTextHtml(rawHtml));
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  disabled = false,
  id,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastEmittedHtmlRef = useRef<string>(value);
  const onChangeRef = useRef(onChange);
  const styleWithCssReadyRef = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (document.activeElement === editor) return;
    if (value === lastEmittedHtmlRef.current && editor.innerHTML === value) return;
    editor.innerHTML = value || '';
    lastEmittedHtmlRef.current = value;
  }, [value]);

  const ensureSemanticCommands = (): void => {
    if (styleWithCssReadyRef.current) return;
    document.execCommand('styleWithCSS', false, 'false');
    styleWithCssReadyRef.current = true;
  };

  const emitChange = (persistReady: boolean): void => {
    const editor = editorRef.current;
    if (!editor) return;

    const nextHtml = persistReady
      ? prepareHtmlForPersist(editor.innerHTML)
      : isEmptyEditorHtml(editor.innerHTML)
        ? ''
        : editor.innerHTML;

    if (persistReady && nextHtml !== editor.innerHTML) {
      editor.innerHTML = nextHtml;
    }

    lastEmittedHtmlRef.current = nextHtml;

    if (persistReady) {
      flushSync(() => {
        onChangeRef.current(nextHtml);
      });
      return;
    }

    onChangeRef.current(nextHtml);
  };

  useEffect(() => {
    const editor = editorRef.current;
    const form = editor?.closest('form');
    if (!form) return;

    const handleFormSubmit = (): void => {
      emitChange(true);
    };

    form.addEventListener('submit', handleFormSubmit, true);
    return () => {
      form.removeEventListener('submit', handleFormSubmit, true);
    };
    // Re-bind when the editor mounts into a form; emitChange reads refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only listener
  }, []);

  const runCommand = (command: RichTextCommand, commandValue?: string): void => {
    const editor = editorRef.current;
    if (!editor || disabled) return;
    editor.focus();
    ensureSemanticCommands();
    document.execCommand(command, false, commandValue);
    emitChange(false);
  };

  const showPlaceholder = !value.trim();

  return (
    <div className="overflow-hidden rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
      <RichTextToolbar onCommand={runCommand} disabled={disabled} />
      <div className="relative">
        {showPlaceholder && placeholder ? (
          <span className="pointer-events-none absolute left-3 top-2 text-sm text-gray-400">
            {placeholder}
          </span>
        ) : null}
        <div
          id={id}
          ref={editorRef}
          role="textbox"
          aria-multiline="true"
          contentEditable={!disabled}
          suppressContentEditableWarning
          className={`${RICH_TEXT_EDITOR_MIN_HEIGHT_CLASS} rich-text-content w-full px-3 py-2 text-sm text-gray-900 outline-none`}
          onInput={() => emitChange(false)}
          onBlur={() => emitChange(true)}
        />
      </div>
    </div>
  );
}
