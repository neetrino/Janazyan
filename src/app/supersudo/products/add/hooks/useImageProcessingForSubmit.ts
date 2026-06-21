interface ProcessImagesForSubmitProps {
  imageUrls: string[];
  featuredImageIndex: number;
  mainProductImage: string;
  variants: Array<{ imageUrl?: string }>;
}

function isStoredImageUrl(url: string): boolean {
  return (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('/')
  );
}

function buildFinalMedia(imageUrls: string[], featuredImageIndex: number): string[] {
  const finalMedia: string[] = [];
  const featuredUrl = imageUrls[featuredImageIndex]?.trim();

  if (featuredUrl && isStoredImageUrl(featuredUrl)) {
    finalMedia.push(featuredUrl);
  }

  imageUrls.forEach((url, index) => {
    if (index === featuredImageIndex) {
      return;
    }
    const trimmed = url?.trim();
    if (trimmed && isStoredImageUrl(trimmed)) {
      finalMedia.push(trimmed);
    }
  });

  return finalMedia;
}

export function processImagesForSubmit({
  imageUrls,
  featuredImageIndex,
  mainProductImage,
  variants,
}: ProcessImagesForSubmitProps): {
  finalMedia: string[];
  mainImage: string | null;
  processedVariants: Array<{ imageUrl?: string }>;
} {
  const hasBase64 = [...imageUrls, mainProductImage, ...variants.map((v) => v.imageUrl ?? '')].some(
    (url) => url.startsWith('data:image/'),
  );

  if (hasBase64) {
    throw new Error(
      'Product images must be uploaded to storage before saving. Please re-upload any images that were not saved.',
    );
  }

  const finalMedia = buildFinalMedia(imageUrls, featuredImageIndex);

  if (finalMedia.length === 0 && mainProductImage && isStoredImageUrl(mainProductImage)) {
    finalMedia.push(mainProductImage);
  }

  const mainImage =
    (imageUrls[featuredImageIndex] && isStoredImageUrl(imageUrls[featuredImageIndex])
      ? imageUrls[featuredImageIndex]
      : null) ??
    (imageUrls.find(isStoredImageUrl) ?? null) ??
    (mainProductImage && isStoredImageUrl(mainProductImage) ? mainProductImage : null);

  return {
    finalMedia,
    mainImage,
    processedVariants: variants,
  };
}
