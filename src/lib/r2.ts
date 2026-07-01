import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  assertR2Configured,
  getR2PublicUrl,
  isR2Configured,
} from '@/lib/r2/r2-config';

export { isR2Configured } from '@/lib/r2/r2-config';

const accountId = process.env.R2_ACCOUNT_ID?.trim();
const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
const bucketName = process.env.R2_BUCKET_NAME?.trim();

const r2 =
  accountId && accessKeyId && secretAccessKey && bucketName
    ? new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      })
    : null;

/**
 * Upload a buffer to R2 and return the public URL.
 */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string,
): Promise<string> {
  assertR2Configured();

  if (!r2 || !bucketName) {
    throw {
      status: 503,
      type: 'https://api.shop.am/problems/config-error',
      title: 'Storage not configured',
      detail: 'R2 client is not initialized.',
    };
  }

  await r2.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  const publicUrl = getR2PublicUrl();
  if (!publicUrl) {
    throw {
      status: 503,
      type: 'https://api.shop.am/problems/config-error',
      title: 'Storage not configured',
      detail: 'R2_PUBLIC_URL is not set.',
    };
  }

  const base = publicUrl.replace(/\/$/, '');
  const path = key.startsWith('/') ? key.slice(1) : key;
  return `${base}/${path}`;
}
