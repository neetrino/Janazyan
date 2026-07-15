'use client';

import type { FormEvent } from 'react';
import {
  PDP_REVIEW_SUBMIT_BUTTON_CLASS,
  PDP_WRITE_REVIEW_BUTTON_CLASS,
} from '../../app/products/[slug]/product-action-bar.constants';
import { useTranslation } from '../../lib/i18n-client';
import { ReviewRating } from './ReviewRating';

interface ReviewFormProps {
  rating: number;
  hoveredRating: number;
  comment: string;
  submitting: boolean;
  editingReviewId: string | null;
  onRatingChange: (rating: number) => void;
  onHover: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

/**
 * Review form component
 */
export function ReviewForm({
  rating,
  hoveredRating,
  comment,
  submitting,
  editingReviewId,
  onRatingChange,
  onHover,
  onCommentChange,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="mb-8 rounded-xl p-5 sm:p-6">
      <h3 className="mb-4 text-xl font-semibold text-gray-900">
        {editingReviewId ? 'Update Your Review' : t('common.reviews.writeReview')}
      </h3>

      {/* Rating Selector */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {t('common.reviews.rating')} *
        </label>
        <ReviewRating
          rating={rating}
          hoveredRating={hoveredRating}
          onRatingChange={onRatingChange}
          onHover={onHover}
          size="lg"
          interactive
        />
      </div>

      {/* Comment Textarea */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {t('common.reviews.comment')} *
        </label>
        <textarea
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          rows={5}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-sky-deep focus:ring-2 focus:ring-sky-deep/20 focus:outline-none"
          placeholder={t('common.reviews.commentPlaceholder')}
          required
        />
      </div>

      {/* Form Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className={PDP_REVIEW_SUBMIT_BUTTON_CLASS}
        >
          {submitting
            ? t('common.reviews.submitting')
            : editingReviewId
              ? 'Update Review'
              : t('common.reviews.submitReview')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={PDP_WRITE_REVIEW_BUTTON_CLASS}
        >
          {t('common.buttons.cancel')}
        </button>
      </div>
    </form>
  );
}




