const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

export type ParsedDataUrl = {
  mime: string;
  buffer: Buffer;
  extension: string;
};

/**
 * Parses a base64 data URL image into buffer and mime metadata.
 */
export function parseDataUrl(dataUrl: string): ParsedDataUrl | null {
  const match = dataUrl.match(/^data:(image\/[a-z+.-]+);base64,(.+)$/i);
  if (!match) {
    return null;
  }
  const mime = match[1].toLowerCase();
  const buffer = Buffer.from(match[2], 'base64');
  const extension = MIME_TO_EXT[mime] ?? 'jpg';
  return { mime, buffer, extension };
}
