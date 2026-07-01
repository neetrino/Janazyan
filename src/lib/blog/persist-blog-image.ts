import { persistR2ImageFromDataUrl } from '@/lib/r2/persist-r2-image';
import { R2_IMAGE_FOLDERS } from '@/lib/r2/r2-image-folders';
import { normalizeBlogImageUrl } from './normalize-blog-image-url';
import { isDataUriImage } from '@/lib/r2/resolve-admin-image-reference';

/** Saves a base64 blog image to R2. */
export async function persistBlogImageFromDataUrl(dataUrl: string): Promise<string> {
  return persistR2ImageFromDataUrl(dataUrl, R2_IMAGE_FOLDERS.blog);
}

/**
 * Resolves image URLs — uploads data URLs to R2, passes through existing URLs.
 */
export async function resolveBlogImageUrls(images: string[] | undefined): Promise<string[]> {
  if (!images?.length) {
    return [];
  }

  const resolved: string[] = [];
  for (const image of images) {
    if (typeof image !== 'string' || !image.trim()) {
      continue;
    }
    if (isDataUriImage(image)) {
      resolved.push(await persistBlogImageFromDataUrl(image));
    } else {
      resolved.push(normalizeBlogImageUrl(image));
    }
  }
  return resolved;
}
