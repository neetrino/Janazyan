import { uploadAdminImagesToR2 } from '@/lib/r2/upload-admin-images-client';
import { R2_IMAGE_FOLDERS } from '@/lib/r2/r2-image-folders';
import type { ImageCompressionOptions } from '@/lib/utils/image-utils';

/**
 * Compresses product image files and uploads them to R2 via the admin upload API.
 */
export async function uploadProductImagesToR2(
  files: File[],
  compressionOptions?: ImageCompressionOptions,
): Promise<string[]> {
  return uploadAdminImagesToR2(files, R2_IMAGE_FOLDERS.products, compressionOptions);
}
