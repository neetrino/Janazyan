import { nanoid } from 'nanoid';
import { uploadToR2 } from '@/lib/r2';
import { parseDataUrl } from '@/lib/r2/parse-data-url';
import { assertR2Configured } from '@/lib/r2/r2-config';
import type { R2ImageFolder } from '@/lib/r2/r2-image-folders';

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
};

function buildStorageFileName(extension: string): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `${date}-${nanoid(10)}.${extension}`;
}

function extensionFromMime(mime: string): string {
  return MIME_TO_EXT[mime.toLowerCase()] ?? 'jpg';
}

function assertImageMime(mime: string): void {
  if (!mime.startsWith('image/')) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'Invalid image MIME type',
    };
  }
}

/** Uploads a binary image buffer to R2 and returns the public URL. */
export async function persistR2ImageFromBuffer(
  buffer: Buffer,
  mime: string,
  folder: R2ImageFolder,
): Promise<string> {
  assertImageMime(mime);
  assertR2Configured();

  const fileName = buildStorageFileName(extensionFromMime(mime));
  const key = `${folder}/${fileName}`;
  return uploadToR2(key, buffer, mime);
}

/** Uploads a base64 data URL image to R2 and returns the public URL. */
export async function persistR2ImageFromDataUrl(
  dataUrl: string,
  folder: R2ImageFolder,
): Promise<string> {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'Invalid image data URL',
    };
  }
  return persistR2ImageFromBuffer(parsed.buffer, parsed.mime, folder);
}
