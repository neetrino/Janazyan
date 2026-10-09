/**
 * Normalize browser contentEditable HTML into semantic tags that survive sanitizeHtml.
 * Chrome often emits <b>/<i> or <span style="font-weight:bold"> instead of <strong>/<em>.
 */
export function normalizeRichTextHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  const trimmed = html.trim();
  if (!trimmed) {
    return '';
  }

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return trimmed;
  }

  const doc = new DOMParser().parseFromString(`<div id="rt-root">${trimmed}</div>`, 'text/html');
  const root = doc.getElementById('rt-root');
  if (!root) {
    return trimmed;
  }

  convertStyledSpans(root);
  replaceTag(root, 'b', 'strong');
  replaceTag(root, 'i', 'em');
  replaceTag(root, 'strike', 's');
  unwrapEmptySpans(root);

  return root.innerHTML.trim();
}

function convertStyledSpans(root: HTMLElement): void {
  const spans = Array.from(root.querySelectorAll('span'));
  for (const span of spans) {
    const style = span.getAttribute('style')?.toLowerCase() ?? '';
    const isBold = /font-weight\s*:\s*(bold|[6-9]00)/.test(style);
    const isItalic = /font-style\s*:\s*italic/.test(style);
    const isUnderline = /text-decoration[^;]*underline/.test(style);
    const isStrike = /text-decoration[^;]*line-through/.test(style);

    if (!isBold && !isItalic && !isUnderline && !isStrike) {
      continue;
    }

    let wrapper: HTMLElement = span;
    if (isBold) {
      wrapper = wrapElement(wrapper, 'strong');
    }
    if (isItalic) {
      wrapper = wrapElement(wrapper, 'em');
    }
    if (isUnderline) {
      wrapper = wrapElement(wrapper, 'u');
    }
    if (isStrike) {
      wrapper = wrapElement(wrapper, 's');
    }

    span.removeAttribute('style');
  }
}

function wrapElement(element: HTMLElement, tagName: string): HTMLElement {
  const wrapper = element.ownerDocument.createElement(tagName);
  element.parentNode?.insertBefore(wrapper, element);
  wrapper.appendChild(element);
  return wrapper;
}

function replaceTag(root: HTMLElement, fromTag: string, toTag: string): void {
  const nodes = Array.from(root.querySelectorAll(fromTag));
  for (const node of nodes) {
    const replacement = node.ownerDocument.createElement(toTag);
    while (node.firstChild) {
      replacement.appendChild(node.firstChild);
    }
    node.parentNode?.replaceChild(replacement, node);
  }
}

function unwrapEmptySpans(root: HTMLElement): void {
  const spans = Array.from(root.querySelectorAll('span'));
  for (const span of spans) {
    const hasAttrs = span.attributes.length > 0;
    if (hasAttrs) {
      continue;
    }
    const parent = span.parentNode;
    if (!parent) {
      continue;
    }
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
  }
}
