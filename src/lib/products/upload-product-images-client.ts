import { getAuthToken } from '@/lib/api-client/auth-utils';
import { ApiError } from '@/lib/api-client/types';
import { parseErrorResponse, createApiError } from '@/lib/api-client/error-handler';
import { compressImageFile, type ImageCompressionOptions } from '@/lib/utils/image-utils';

const UPLOAD_ENDPOINT = '/api/v1/admin/products/upload-images';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

const DEFAULT_COMPRESSION: ImageCompressionOptions = {
  maxSizeMB: 2,
  maxWidthOrHeight: 1920,
  useWebWorker: false,
  initialQuality: 0.8,
};

type UploadImagesResponse = {
  urls: string[];
};

/**
 * Compresses image files and uploads them to R2 via the admin products upload API.
 */
export async function uploadProductImagesToR2(
  files: File[],
  compressionOptions?: ImageCompressionOptions,
): Promise<string[]> {
  if (files.length === 0) {
    return [];
  }

  const formData = new FormData();
  const compression = compressionOptions ?? DEFAULT_COMPRESSION;

  for (const file of files) {
    const compressed = await compressImageFile(file, compression);
    formData.append('images', compressed, compressed.name || file.name);
  }

  const headers: Record<string, string> = {};
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${UPLOAD_ENDPOINT}`;
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const { errorText, errorData } = await parseErrorResponse(response);
    throw createApiError(response, errorText, errorData);
  }

  const data = (await response.json()) as UploadImagesResponse;
  if (!Array.isArray(data.urls) || data.urls.length === 0) {
    throw new ApiError('Upload response did not include image URLs', response.status, response.statusText);
  }

  return data.urls;
}
