import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import { parseDataUrl } from '../r2/parse-data-url';
import { isR2Configured, uploadToR2 } from '../r2';

const LOGO_FOLDER = 'partner-stores';

const R2_NOT_CONFIGURED_DETAIL =
  'R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL in .env (or use a logo path like /stores/logos/sas.svg without uploading).';

function buildStorageFileName(extension: string): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `${date}-${nanoid(10)}.${extension}`;
}

/**
 * Saves a base64 image to R2, or to public/partner-stores in local development.
 */
export async function persistPartnerStoreLogoFromDataUrl(dataUrl: string): Promise<string> {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'Invalid logo image data URL',
    };
  }

  const fileName = buildStorageFileName(parsed.extension);

  if (isR2Configured()) {
    const key = `${LOGO_FOLDER}/${fileName}`;
    const url = await uploadToR2(key, parsed.buffer, parsed.mime);
    if (!url) {
      throw {
        status: 500,
        type: 'https://api.shop.am/problems/internal-error',
        title: 'Upload failed',
        detail: 'Failed to upload logo to storage',
      };
    }
    return url;
  }

  if (process.env.NODE_ENV === 'development') {
    const directory = path.join(process.cwd(), 'public', LOGO_FOLDER);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, fileName), parsed.buffer);
    return `/${LOGO_FOLDER}/${fileName}`;
  }

  throw {
    status: 503,
    type: 'https://api.shop.am/problems/config-error',
    title: 'Storage not configured',
    detail: R2_NOT_CONFIGURED_DETAIL,
  };
}
