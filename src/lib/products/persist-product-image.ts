import { persistR2ImageFromBuffer, persistR2ImageFromDataUrl } from '@/lib/r2/persist-r2-image';
import { R2_IMAGE_FOLDERS } from '@/lib/r2/r2-image-folders';

/** Saves a binary product image to R2. */
export async function persistProductImageFromBuffer(buffer: Buffer, mime: string): Promise<string> {
  return persistR2ImageFromBuffer(buffer, mime, R2_IMAGE_FOLDERS.products);
}

/** Saves a product base64 image to R2. */
export async function persistProductImageFromDataUrl(dataUrl: string): Promise<string> {
  return persistR2ImageFromDataUrl(dataUrl, R2_IMAGE_FOLDERS.products);
}
