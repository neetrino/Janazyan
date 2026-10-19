'use client';

import { useEffect, useState, useCallback, useRef, ChangeEvent } from 'react';
import { apiClient } from '../../../lib/api-client';
import { useTranslation } from '../../../lib/i18n-client';
import { showToast } from '../../../components/Toast';
import { logger } from "@/lib/utils/logger";
import { useAdminDialogs } from '../context/AdminDialogsContext';
import {
  ADMIN_LIST_CACHE_KEYS,
  fetchAdminListCached,
  invalidateAdminListCache,
} from '@/lib/admin/admin-list-client-cache';
import { R2_IMAGE_FOLDERS } from '@/lib/r2/r2-image-folders';
import { uploadAdminImagesToR2 } from '@/lib/r2/upload-admin-images-client';
import { emptyNamedForm, filledNamePayload, namedFormFrom, updateNamedForm, updateNamedText, type NamedFormState } from './attributeForm';

export interface AttributeValue {
  id: string;
  value: string;
  label: string;
  translations?: Array<{ locale: string; label: string }>;
  colors?: string[];
  imageUrl?: string | null;
}

export interface Attribute {
  id: string;
  key: string;
  name: string;
  translations?: Array<{ locale: string; name: string }>;
  type: string;
  filterable: boolean;
  values: AttributeValue[];
}

export function useAttributes() {
  const { t } = useTranslation();
  const { confirm: confirmDialog } = useAdminDialogs();
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<NamedFormState>(emptyNamedForm());
  const [savingAttribute, setSavingAttribute] = useState(false);
  const [expandedAttributes, setExpandedAttributes] = useState<Set<string>>(new Set());
  
  // Form states
  const [formData, setFormData] = useState<NamedFormState>(emptyNamedForm());
  
  const [newValueForm, setNewValueForm] = useState<NamedFormState>(emptyNamedForm());
  const [addingValueTo, setAddingValueTo] = useState<string | null>(null);
  const [deletingValue, setDeletingValue] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<{ attributeId: string; value: AttributeValue } | null>(null);
  const [valueError, setValueError] = useState<string | null>(null);
  const [expandedValueId, setExpandedValueId] = useState<string | null>(null);
  
  // Inline edit form states
  const [editingValueForm, setEditingValueForm] = useState<NamedFormState>(emptyNamedForm());
  const [editingColors, setEditingColors] = useState<string[]>([]);
  const [editingImageUrl, setEditingImageUrl] = useState<string | null>(null);
  const [savingValue, setSavingValue] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAttributes = useCallback(async () => {
    try {
      setLoading(true);
      logger.debug('📋 [ADMIN] Fetching attributes...');
      const response = await fetchAdminListCached(
        ADMIN_LIST_CACHE_KEYS.attributes,
        () => apiClient.get<{ data: Attribute[] }>('/api/v1/admin/attributes'),
      );
      setAttributes(response.data || []);
      logger.debug('✅ [ADMIN] Attributes loaded:', response.data?.length || 0);
    } catch (err) {
      console.error('❌ [ADMIN] Error fetching attributes:', err);
      setAttributes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttributes();
  }, [fetchAttributes]);

  const handleCreateAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showToast(t('admin.attributes.fillName'), 'warning');
      return;
    }

    try {
      await apiClient.post('/api/v1/admin/attributes', {
        name: formData.name.trim(),
        key: formData.slug,
        translations: filledNamePayload(formData, 'name'),
        type: 'select',
        filterable: true,
      });
      
      logger.debug('✅ [ADMIN] Attribute created successfully');
      setShowAddForm(false);
      setFormData(emptyNamedForm());
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.attributes);
      fetchAttributes();
      showToast(t('admin.attributes.createdSuccess'), 'success');
    } catch (err: any) {
      console.error('❌ [ADMIN] Error creating attribute:', err);
      const errorMessage = err?.data?.detail || err?.message || 'Failed to create attribute';
      showToast(t('admin.attributes.errorCreating').replace('{message}', errorMessage), 'error');
    }
  };

  const handleDeleteAttribute = async (attributeId: string, attributeName: string) => {
    const isConfirmed = await confirmDialog({
      title: t('admin.common.delete'),
      message: t('admin.attributes.deleteConfirm').replace('{name}', attributeName),
      confirmText: t('admin.common.delete'),
      destructive: true,
    });
    if (!isConfirmed) {
      return;
    }

    try {
      logger.debug(`🗑️ [ADMIN] Deleting attribute: ${attributeName} (${attributeId})`);
      await apiClient.delete(`/api/v1/admin/attributes/${attributeId}`);
      logger.debug('✅ [ADMIN] Attribute deleted successfully');
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.attributes);
      fetchAttributes();
      showToast(t('admin.attributes.deletedSuccess'), 'success');
    } catch (err: any) {
      console.error('❌ [ADMIN] Error deleting attribute:', err);
      const errorMessage = err?.data?.detail || err?.message || 'Failed to delete attribute';
      showToast(t('admin.attributes.errorDeleting').replace('{message}', errorMessage), 'error');
    }
  };

  const handleUpdateAttributeName = async (attributeId: string) => {
    if (!editingForm.name.trim()) {
      showToast(t('admin.attributes.fillName'), 'warning');
      return;
    }

    try {
      setSavingAttribute(true);
      logger.debug(`✏️ [ADMIN] Updating attribute name: ${attributeId}`);
      await apiClient.patch(`/api/v1/admin/attributes/${attributeId}/translations`, {
        name: editingForm.name.trim(),
        key: editingForm.slug,
        translations: filledNamePayload(editingForm, 'name'),
      });
      logger.debug('✅ [ADMIN] Attribute name updated successfully');
      setEditingAttribute(null);
      setEditingForm(emptyNamedForm());
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.attributes);
      fetchAttributes();
      showToast(t('admin.attributes.nameUpdatedSuccess') || 'Attribute name updated successfully', 'success');
    } catch (err: any) {
      console.error('❌ [ADMIN] Error updating attribute name:', err);
      const errorMessage = err?.data?.detail || err?.message || 'Failed to update attribute name';
      showToast(errorMessage, 'error');
    } finally {
      setSavingAttribute(false);
    }
  };

  const toggleAttributeEdit = (attribute: Attribute) => {
    if (editingAttribute === attribute.id) {
      // Close
      setEditingAttribute(null);
      setEditingForm(emptyNamedForm());
    } else {
      setEditingAttribute(attribute.id);
      setEditingForm(namedFormFrom(
        attribute.translations?.map((row) => ({ locale: row.locale, text: row.name })),
        attribute.name,
        attribute.key,
      ));
    }
  };

  const handleAddValue = async (attributeId: string) => {
    if (!newValueForm.name.trim()) {
      showToast(t('admin.attributes.enterValue'), 'warning');
      setValueError(t('admin.attributes.enterValue'));
      return;
    }

    const attribute = attributes.find((attr) => attr.id === attributeId);
    if (!attribute) {
      showToast(t('admin.attributes.attributeNotFound'), 'error');
      return;
    }

    const nextKey = newValueForm.slug.trim().toLowerCase();
    const existingValue = attribute.values.find((val) => val.value.toLowerCase() === nextKey);
    if (existingValue) {
      const errorMsg = t('admin.attributes.valueAlreadyExists').replace('{value}', newValueForm.name.trim());
      showToast(errorMsg, 'error', 5000);
      setValueError(errorMsg);
      return;
    }

    setValueError(null);

    try {
      setAddingValueTo(attributeId);
      await apiClient.post(`/api/v1/admin/attributes/${attributeId}/values`, {
        label: newValueForm.name.trim(),
        value: newValueForm.slug,
        translations: filledNamePayload(newValueForm, 'label'),
      });
      
      setNewValueForm(emptyNamedForm());
      setValueError(null);
      setAddingValueTo(null);
      showToast(t('admin.attributes.valueAddedSuccess'), 'success');
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.attributes);
      fetchAttributes();
    } catch (err: any) {
      console.error('❌ [ADMIN] Error adding value:', err);
      const errorMessage = err?.data?.detail || err?.message || t('admin.attributes.failedToAddValue');
      
      // Check if it's a duplicate error from backend
      if (errorMessage.includes('already exists') || errorMessage.includes('уже существует')) {
        const duplicateMsg = t('admin.attributes.valueAlreadyExists').replace('{value}', newValueForm.name.trim());
        showToast(duplicateMsg, 'error', 5000);
        setValueError(duplicateMsg);
      } else {
        showToast(errorMessage, 'error', 5000);
        setValueError(errorMessage);
      }
      setAddingValueTo(null);
    }
  };

  const handleDeleteValue = async (attributeId: string, valueId: string, valueLabel: string) => {
    const isConfirmed = await confirmDialog({
      title: t('admin.common.delete'),
      message: t('admin.attributes.deleteValueConfirm').replace('{label}', valueLabel),
      confirmText: t('admin.common.delete'),
      destructive: true,
    });
    if (!isConfirmed) {
      return;
    }

    try {
      setDeletingValue(valueId);
      logger.debug(`🗑️ [ADMIN] Deleting value: ${valueLabel} (${valueId})`);
      await apiClient.delete(`/api/v1/admin/attributes/${attributeId}/values/${valueId}`);
      logger.debug('✅ [ADMIN] Value deleted successfully');
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.attributes);
      fetchAttributes();
      setDeletingValue(null);
      showToast(t('admin.attributes.valueDeletedSuccess'), 'success');
    } catch (err: any) {
      console.error('❌ [ADMIN] Error deleting value:', err);
      const errorMessage = err?.data?.detail || err?.message || 'Failed to delete value';
      showToast(t('admin.attributes.errorDeletingValue').replace('{message}', errorMessage), 'error');
      setDeletingValue(null);
    }
  };

  const handleUpdateValue = async (data: {
    label?: string;
    translations?: Array<Record<string, string>>;
    colors?: string[];
    imageUrl?: string | null;
  }) => {
    if (!editingValue) return;

    try {
      logger.debug('✏️ [ADMIN] Updating value:', { 
        valueId: editingValue.value.id, 
        attributeId: editingValue.attributeId,
        data,
        colorsType: typeof data.colors,
        colorsIsArray: Array.isArray(data.colors),
        colorsLength: data.colors?.length
      });
      await apiClient.patch(`/api/v1/admin/attributes/${editingValue.attributeId}/values/${editingValue.value.id}`, data);
      logger.debug('✅ [ADMIN] Value updated successfully');
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.attributes);
      fetchAttributes();
      showToast(t('admin.attributes.valueUpdatedSuccess'), 'success');
    } catch (err: any) {
      console.error('❌ [ADMIN] Error updating value:', err);
      const errorMessage = err?.data?.detail || err?.message || 'Failed to update value';
      showToast(t('admin.attributes.errorUpdatingValue')?.replace('{message}', errorMessage) || errorMessage, 'error');
      throw err;
    }
  };

  const toggleValueEdit = (attributeId: string, value: AttributeValue) => {
    if (expandedValueId === value.id) {
      // Close
      setExpandedValueId(null);
      setEditingValue(null);
      setEditingValueForm(emptyNamedForm());
      setEditingColors([]);
      setEditingImageUrl(null);
    } else {
      setExpandedValueId(value.id);
      setEditingValue({ attributeId, value });
      setEditingValueForm(namedFormFrom(
        value.translations?.map((row) => ({ locale: row.locale, text: row.label })),
        value.label,
        value.value,
      ));
      setEditingColors(value.colors || []);
      setEditingImageUrl(value.imageUrl || null);
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const imageFile = files.find((file) => file.type.startsWith('image/'));
    if (!imageFile) {
      showToast(t('admin.attributes.valueModal.selectImageFile'), 'warning');
      if (event.target) {
        event.target.value = '';
      }
      return;
    }

    try {
      setImageUploading(true);
      const uploadedUrls = await uploadAdminImagesToR2([imageFile], R2_IMAGE_FOLDERS.attributes);
      if (uploadedUrls.length === 0) {
        showToast(t('admin.attributes.valueModal.failedToProcessImage'), 'error');
        return;
      }
      setEditingImageUrl(uploadedUrls[0]);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t('admin.attributes.valueModal.failedToProcessImage');
      console.error('❌ [ADMIN] Error uploading image:', error);
      showToast(message, 'error');
    } finally {
      setImageUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setEditingImageUrl(null);
  };

  const handleSaveInlineValue = async () => {
    if (!editingValue) return;

    try {
      setSavingValue(true);
      await handleUpdateValue({
        label: editingValueForm.name.trim(),
        translations: filledNamePayload(editingValueForm, 'label'),
        colors: editingColors.length > 0 ? editingColors : undefined,
        imageUrl: editingImageUrl,
      });
      setExpandedValueId(null);
      setEditingValue(null);
      setEditingValueForm(emptyNamedForm());
      setEditingColors([]);
      setEditingImageUrl(null);
    } catch (error: any) {
      console.error('❌ [ADMIN] Error saving value:', error);
    } finally {
      setSavingValue(false);
    }
  };

  const toggleExpand = (attributeId: string) => {
    setExpandedAttributes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(attributeId)) {
        newSet.delete(attributeId);
      } else {
        newSet.add(attributeId);
      }
      return newSet;
    });
  };

  return {
    // State
    attributes,
    loading,
    showAddForm,
    editingAttribute,
    editingForm,
    savingAttribute,
    expandedAttributes,
    formData,
    newValueForm,
    addingValueTo,
    deletingValue,
    editingValue,
    valueError,
    expandedValueId,
    editingValueForm,
    editingColors,
    editingImageUrl,
    savingValue,
    imageUploading,
    fileInputRef,
    // Actions
    setShowAddForm,
    setFormData,
    setNewValueForm,
    setEditingForm,
    setEditingValueForm,
    setEditingColors,
    setEditingImageUrl,
    setValueError,
    handleCreateAttribute,
    handleDeleteAttribute,
    handleUpdateAttributeName,
    toggleAttributeEdit,
    handleAddValue,
    handleDeleteValue,
    toggleValueEdit,
    handleImageUpload,
    handleRemoveImage,
    handleSaveInlineValue,
    toggleExpand,
  };
}



