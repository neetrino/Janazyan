import { useState, useRef } from 'react';
import type { Category, Attribute, Variant, ProductLabel, GeneratedVariant } from '../types';
import type { CurrencyCode } from '@/lib/currency';

export function useProductFormState() {
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    descriptionHtml: '',
    brandIds: [] as string[],
    primaryCategoryId: '',
    categoryIds: [] as string[],
    published: false,
    featured: false,
    imageUrls: [] as string[],
    featuredImageIndex: 0,
    mainProductImage: '' as string,
    variants: [] as Variant[],
    labels: [] as ProductLabel[],
  });
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const variantImageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const attributesDropdownRef = useRef<HTMLDivElement | null>(null);
  const [attributesDropdownOpen, setAttributesDropdownOpen] = useState(false);
  const [colorImageTarget, setColorImageTarget] = useState<{ variantId: string; colorValue: string } | null>(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [useNewCategory, setUseNewCategory] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [newSizeName, setNewSizeName] = useState('');
  const [addingColor, setAddingColor] = useState(false);
  const [addingSize, setAddingSize] = useState(false);
  const [colorMessage, setColorMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [sizeMessage, setSizeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [defaultCurrency, setDefaultCurrency] = useState<CurrencyCode>('AMD');
  const [productType, setProductType] = useState<'simple' | 'variable'>('variable');
  const [simpleProductData, setSimpleProductData] = useState({
    price: '',
    compareAtPrice: '',
    sku: '',
    quantity: '',
  });
  const [selectedAttributesForVariants, setSelectedAttributesForVariants] = useState<Set<string>>(new Set());
  const [selectedAttributeValueIds, setSelectedAttributeValueIds] = useState<Record<string, string[]>>({});
  const [openValueModal, setOpenValueModal] = useState<{ variantId: string; attributeId: string } | null>(null);
  const [generatedVariants, setGeneratedVariants] = useState<GeneratedVariant[]>([]);
  const [hasVariantsToLoad, setHasVariantsToLoad] = useState(false);

  return {
    loading,
    setLoading,
    loadingProduct,
    setLoadingProduct,
    categories,
    setCategories,
    attributes,
    setAttributes,
    formData,
    setFormData,
    categoriesExpanded,
    setCategoriesExpanded,
    attributesDropdownOpen,
    setAttributesDropdownOpen,
    fileInputRef,
    variantImageInputRefs,
    attributesDropdownRef,
    colorImageTarget,
    setColorImageTarget,
    imageUploadLoading,
    setImageUploadLoading,
    imageUploadError,
    setImageUploadError,
    newCategoryName,
    setNewCategoryName,
    useNewCategory,
    setUseNewCategory,
    newColorName,
    setNewColorName,
    newSizeName,
    setNewSizeName,
    addingColor,
    setAddingColor,
    addingSize,
    setAddingSize,
    colorMessage,
    setColorMessage,
    sizeMessage,
    setSizeMessage,
    defaultCurrency,
    setDefaultCurrency,
    productType,
    setProductType,
    simpleProductData,
    setSimpleProductData,
    selectedAttributesForVariants,
    setSelectedAttributesForVariants,
    selectedAttributeValueIds,
    setSelectedAttributeValueIds,
    openValueModal,
    setOpenValueModal,
    generatedVariants,
    setGeneratedVariants,
    hasVariantsToLoad,
    setHasVariantsToLoad,
  };
}
