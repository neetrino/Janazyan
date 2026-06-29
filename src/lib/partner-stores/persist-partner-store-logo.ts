import { persistR2ImageFromDataUrl } from '@/lib/r2/persist-r2-image';
import { R2_IMAGE_FOLDERS } from '@/lib/r2/r2-image-folders';

/** Saves a base64 partner store logo to R2. */
export async function persistPartnerStoreLogoFromDataUrl(dataUrl: string): Promise<string> {
  return persistR2ImageFromDataUrl(dataUrl, R2_IMAGE_FOLDERS.partnerStores);
}
