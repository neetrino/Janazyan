'use client';

import { useMemo, useState } from 'react';
import { Input } from '@shop/ui';
import { useTranslation } from '../../../lib/i18n-client';
import { useAttributes, type Attribute } from './useAttributes';
import { updateNamedForm, updateNamedText, emptyNamedForm } from './attributeForm';
import { ValueEditForm } from './ValueEditForm';
import { AdminSideDrawer } from '../components/AdminSideDrawer';
import { ContentLanguageFields } from '../components/ContentLanguageFields';

function filterAttributesBySearch(attributes: Attribute[], normalizedSearch: string): Attribute[] {
  if (!normalizedSearch) {
    return attributes;
  }

  return attributes.filter((attribute) => {
    const attributeMatches =
      attribute.name.toLowerCase().includes(normalizedSearch) ||
      attribute.key.toLowerCase().includes(normalizedSearch) ||
      attribute.translations?.some((row) => row.name.toLowerCase().includes(normalizedSearch));

    if (attributeMatches) {
      return true;
    }

    return attribute.values.some((value) =>
      value.label.toLowerCase().includes(normalizedSearch) ||
      value.translations?.some((row) => row.label.toLowerCase().includes(normalizedSearch)),
    );
  });
}

export function AttributesPageContent() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const {
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
  } = useAttributes();
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredAttributes = useMemo(
    () => filterAttributesBySearch(attributes, normalizedSearch),
    [attributes, normalizedSearch],
  );

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
        <p className="text-sm text-gray-600">{t('admin.attributes.loadingAttributes')}</p>
      </div>
    );
  }

  return (
    <>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-gray-600">{t('admin.attributes.subtitle')}</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {showAddForm ? t('admin.attributes.cancel') : t('admin.attributes.addAttribute')}
          </button>
        </div>
        <div className="mb-6">
          <Input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t('admin.attributes.namePlaceholder')}
            className="max-w-md"
          />
        </div>

        <AdminSideDrawer
          open={showAddForm}
          onClose={() => {
            setShowAddForm(false);
            setFormData(emptyNamedForm());
          }}
          title={t('admin.attributes.createNewAttribute')}
          side="right"
          size="wide"
          footer={
            <div className="flex gap-3">
              <button
                type="submit"
                form="attribute-form"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                {t('admin.attributes.createAttribute')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData(emptyNamedForm());
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t('admin.attributes.cancel')}
              </button>
            </div>
          }
        >
          <form id="attribute-form" onSubmit={handleCreateAttribute} className="space-y-4">
            <ContentLanguageFields
              syncKey="new-attribute"
              textLabel={t('admin.attributes.name')}
              slugLabel={t('admin.attributes.key')}
              slugHint={t('admin.attributes.keyAutoGenerated')}
              texts={formData.translations}
              slug={formData.slug}
              onChange={(locale, patch) => setFormData(updateNamedForm(formData, locale, patch))}
            />
          </form>
        </AdminSideDrawer>

        {/* Attributes List */}
        {filteredAttributes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.attributes.noAttributes')}</h3>
            <p className="text-gray-600 mb-4">{t('admin.attributes.getStarted')}</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {t('admin.attributes.createAttribute')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAttributes.map((attribute) => {
              const isExpanded = expandedAttributes.has(attribute.id);
              return (
                <div
                  key={attribute.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Attribute Header */}
                  <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <button
                        onClick={() => toggleExpand(attribute.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg
                          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <div className="flex-1">
                        {editingAttribute === attribute.id ? (
                          <div className="space-y-3">
                            <ContentLanguageFields
                              syncKey={attribute.id}
                              textLabel={t('admin.attributes.name')}
                              slugLabel={t('admin.attributes.key')}
                              slugHint={t('admin.attributes.keyAutoGenerated')}
                              texts={editingForm.translations}
                              slug={editingForm.slug}
                              onChange={(locale, patch) => setEditingForm(updateNamedForm(editingForm, locale, patch))}
                            />
                            <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateAttributeName(attribute.id)}
                              disabled={!editingForm.name.trim() || savingAttribute}
                              className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {savingAttribute ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  {t('admin.attributes.saving') || 'Saving...'}
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  {t('admin.attributes.save') || 'Save'}
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => toggleAttributeEdit(attribute)}
                              disabled={savingAttribute}
                              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                            >
                              {t('admin.attributes.cancel')}
                            </button>
                          </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-gray-900">{attribute.name}</h3>
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                {attribute.key}
                              </span>
                              {attribute.filterable && (
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                  {t('admin.attributes.filterable')}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {attribute.values.length === 1 
                                ? t('admin.attributes.values').replace('{count}', attribute.values.length.toString())
                                : t('admin.attributes.valuesPlural').replace('{count}', attribute.values.length.toString())
                              }
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {editingAttribute !== attribute.id && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleAttributeEdit(attribute)}
                          className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title={t('admin.attributes.editAttribute') || 'Edit attribute'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteAttribute(attribute.id, attribute.name)}
                          className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title={t('admin.attributes.deleteAttribute')}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Values Section */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      {/* Add Value Form */}
                      <div className="mb-4 space-y-3">
                        <ContentLanguageFields
                          syncKey={`value-${attribute.id}`}
                          textLabel={t('admin.attributes.addNewValue')}
                          slugLabel={t('admin.attributes.key')}
                          slugHint={t('admin.attributes.keyAutoGenerated')}
                          texts={newValueForm.translations}
                          slug={newValueForm.slug}
                          onChange={(locale, patch) => {
                            setNewValueForm(updateNamedForm(newValueForm, locale, patch));
                            if (valueError) {
                              setValueError(null);
                            }
                          }}
                        />
                        {valueError && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {valueError}
                          </p>
                        )}
                        <button
                          onClick={() => handleAddValue(attribute.id)}
                          disabled={!newValueForm.name.trim() || addingValueTo === attribute.id}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {addingValueTo === attribute.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {t('admin.attributes.adding')}
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                {t('admin.attributes.add')}
                              </>
                            )}
                          </button>
                      </div>

                      {/* Values List */}
                      {attribute.values.length === 0 ? (
                        <p className="text-sm text-gray-500 py-4 text-center">{t('admin.attributes.noValuesYet')}</p>
                      ) : (
                        <div className="space-y-2">
                          {attribute.values.map((value) => {
                            const isExpanded = expandedValueId === value.id;
                            return (
                              <div key={value.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                {/* Value Card */}
                                <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center gap-2 flex-1">
                                    {/* Color swatch or image */}
                                    {value.colors && value.colors.length > 0 ? (
                                      <span
                                        className="inline-block w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                                        style={{ backgroundColor: value.colors[0] }}
                                        title={value.colors[0]}
                                      />
                                    ) : value.imageUrl ? (
                                      <img
                                        src={value.imageUrl}
                                        alt={value.label}
                                        className="w-5 h-5 object-cover rounded border border-gray-300 flex-shrink-0"
                                      />
                                    ) : null}
                                    <span className="text-sm font-medium text-gray-900">{value.label}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => toggleValueEdit(attribute.id, value)}
                                      className="text-gray-600 hover:text-gray-900 transition-colors"
                                      title={t('admin.attributes.configureValue') || 'Configure value'}
                                    >
                                      <svg
                                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteValue(attribute.id, value.id, value.label)}
                                      disabled={deletingValue === value.id}
                                      className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                                      title={t('admin.attributes.deleteValue')}
                                    >
                                      {deletingValue === value.id ? (
                                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {/* Inline Edit Form */}
                                {isExpanded && (
                                  <ValueEditForm
                                    attributeId={attribute.id}
                                    value={value}
                                    editingValueForm={editingValueForm}
                                    editingColors={editingColors}
                                    editingImageUrl={editingImageUrl}
                                    savingValue={savingValue}
                                    imageUploading={imageUploading}
                                    fileInputRef={fileInputRef}
                                    onTextChange={(locale, text) => setEditingValueForm(updateNamedText(editingValueForm, locale, text))}
                                    onColorsChange={setEditingColors}
                                    onImageUpload={handleImageUpload}
                                    onRemoveImage={handleRemoveImage}
                                    onSave={handleSaveInlineValue}
                                    onCancel={() => toggleValueEdit(attribute.id, value)}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

    </>
  );
}

