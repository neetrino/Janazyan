'use client';

import type { ChangeEvent } from 'react';
import { ApiError } from '@/lib/api-client/types';
import { uploadProductImagesToR2 } from '@/lib/products/upload-product-images-client';
import type { Variant } from '../types';
import type { GeneratedVariant } from '../types';
import { logger } from '@/lib/utils/logger';

interface UseImageHandlingProps {
  imageUrls: string[];
  featuredImageIndex: number;
  variants: Variant[];
  generatedVariants: GeneratedVariant[];
  colorImageTarget: { variantId: string; colorValue: string } | null;
  setImageUrls: (updater: (prev: string[]) => string[]) => void;
  setFeaturedImageIndex: (index: number) => void;
  setMainProductImage: (image: string) => void;
  setVariants: (updater: (prev: Variant[]) => Variant[]) => void;
  setGeneratedVariants: (updater: (prev: GeneratedVariant[]) => GeneratedVariant[]) => void;
  setImageUploadLoading: (loading: boolean) => void;
  setImageUploadError: (error: string | null) => void;
  setColorImageTarget: (target: { variantId: string; colorValue: string } | null) => void;
  t: (key: string) => string;
}

interface UseImageHandlingReturn {
  addImageUrl: () => void;
  removeImageUrl: (index: number) => void;
  updateImageUrl: (index: number, url: string) => void;
  setFeaturedImage: (index: number) => void;
  handleUploadImages: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleUploadVariantImage: (variantId: string, event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleUploadColorImages: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  addColorImages: (variantId: string, colorValue: string, images: string[]) => void;
}

function resolveUploadError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    const data = error.data as { detail?: string } | undefined;
    return data?.detail ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

function filterImageFiles(files: File[]): { imageFiles: File[]; errors: string[] } {
  const imageFiles: File[] = [];
  const errors: string[] = [];

  files.forEach((file) => {
    if (file.type.startsWith('image/')) {
      imageFiles.push(file);
      return;
    }
    errors.push(`"${file.name}" is not an image file`);
  });

  return { imageFiles, errors };
}

export function useImageHandling({
  imageUrls,
  featuredImageIndex,
  variants,
  generatedVariants,
  colorImageTarget,
  setImageUrls,
  setFeaturedImageIndex,
  setMainProductImage,
  setVariants,
  setGeneratedVariants,
  setImageUploadLoading,
  setImageUploadError,
  setColorImageTarget,
  t,
}: UseImageHandlingProps): UseImageHandlingReturn {
  const addImageUrl = () => {
    setImageUrls((prev) => [...prev, '']);
  };

  const removeImageUrl = (index: number) => {
    setImageUrls((prev) => {
      const newUrls = prev.filter((_, i) => i !== index);
      let newFeaturedIndex = featuredImageIndex;
      if (index === featuredImageIndex) {
        newFeaturedIndex = 0;
      } else if (index < featuredImageIndex) {
        newFeaturedIndex = Math.max(0, featuredImageIndex - 1);
      }
      const finalFeaturedIndex = newUrls.length === 0 ? 0 : Math.min(newFeaturedIndex, newUrls.length - 1);
      const mainImage = newUrls.length > 0 && newUrls[finalFeaturedIndex] ? newUrls[finalFeaturedIndex] : '';
      setFeaturedImageIndex(finalFeaturedIndex);
      setMainProductImage(mainImage);
      return newUrls;
    });
  };

  const updateImageUrl = (index: number, url: string) => {
    setImageUrls((prev) => {
      const newUrls = [...prev];
      newUrls[index] = url;
      return newUrls;
    });
  };

  const setFeaturedImage = (index: number) => {
    if (index < 0 || index >= imageUrls.length) {
      return;
    }
    const mainImage = imageUrls[index] || '';
    setFeaturedImageIndex(index);
    setMainProductImage(mainImage);
  };

  const addColorImages = (variantId: string, colorValue: string, images: string[]) => {
    logger.debug('Adding images to color variant', {
      variantId,
      colorValue,
      imagesCount: images.length,
    });

    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantId) {
          const updatedColors = v.colors.map((c) => {
            if (c.colorValue === colorValue) {
              const uniqueNewImages = images.filter((newImg) => !c.images.includes(newImg));
              const newImages = [...c.images, ...uniqueNewImages];
              return { ...c, images: newImages };
            }
            return c;
          });
          return { ...v, colors: updatedColors };
        }
        return v;
      }),
    );
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const { imageFiles, errors } = filterImageFiles(files);

    if (errors.length > 0) {
      setImageUploadError(errors.join('; '));
    }

    if (imageFiles.length === 0) {
      return [];
    }

    return uploadProductImagesToR2(imageFiles);
  };

  const handleUploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    logger.debug('Starting R2 upload', { count: files.length });
    setImageUploadLoading(true);
    setImageUploadError(null);

    try {
      const uploadedUrls = await uploadFiles(files);

      if (uploadedUrls.length === 0) {
        setImageUploadError(t('admin.products.add.failedToProcessImages') || 'Failed to upload images');
        return;
      }

      setImageUrls((prev) => {
        const newImageUrls = [...prev, ...uploadedUrls];
        if (prev.length === 0 && newImageUrls.length > 0) {
          setFeaturedImageIndex(0);
          setMainProductImage(newImageUrls[0]);
        }
        return newImageUrls;
      });
    } catch (error: unknown) {
      logger.error('Product image upload failed', { error });
      setImageUploadError(
        resolveUploadError(error, t('admin.products.add.failedToProcessImages') || 'Failed to upload images'),
      );
    } finally {
      setImageUploadLoading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleUploadVariantImage = async (variantId: string, event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    setImageUploadLoading(true);
    setImageUploadError(null);

    try {
      const uploadedUrls = await uploadFiles([files[0]]);
      if (uploadedUrls.length === 0) {
        setImageUploadError(t('admin.products.add.failedToProcessImage') || 'Failed to upload image');
        return;
      }

      setGeneratedVariants((prev) =>
        prev.map((v) => (v.id === variantId ? { ...v, image: uploadedUrls[0] } : v)),
      );
      logger.debug('Variant image uploaded to R2', { variantId });
    } catch (error: unknown) {
      logger.error('Variant image upload failed', { error });
      setImageUploadError(
        resolveUploadError(error, t('admin.products.add.failedToProcessImage') || 'Failed to upload image'),
      );
    } finally {
      setImageUploadLoading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleUploadColorImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length || !colorImageTarget) {
      if (event.target) {
        event.target.value = '';
      }
      return;
    }

    setImageUploadLoading(true);
    setImageUploadError(null);

    try {
      const uploadedUrls = await uploadFiles(files);
      if (uploadedUrls.length === 0) {
        setImageUploadError(t('admin.products.add.failedToProcessImages') || 'Failed to upload images');
        return;
      }

      addColorImages(colorImageTarget.variantId, colorImageTarget.colorValue, uploadedUrls);
      logger.debug('Color variant images uploaded to R2', { count: uploadedUrls.length });
    } catch (error: unknown) {
      logger.error('Color variant image upload failed', { error });
      setImageUploadError(
        resolveUploadError(error, t('admin.products.add.failedToProcessImages') || 'Failed to upload images'),
      );
    } finally {
      setImageUploadLoading(false);
      if (event.target) {
        event.target.value = '';
      }
      setColorImageTarget(null);
    }
  };

  return {
    addImageUrl,
    removeImageUrl,
    updateImageUrl,
    setFeaturedImage,
    handleUploadImages,
    handleUploadVariantImage,
    handleUploadColorImages,
    addColorImages,
  };
}
