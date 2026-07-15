'use client';

import { STOREFRONT_SKY_ACTION_BUTTON_CLASS } from '../../app/products/[slug]/product-action-bar.constants';
import { formatDate, type Review } from './utils';

interface ReviewItemProps {
  review: Review;
  currentUserId?: string;
  onEdit: (review: Review) => void;
}

/**
 * Single review item component
 */
export function ReviewItem({ review, currentUserId, onEdit }: ReviewItemProps) {
  const isOwnReview = currentUserId && review.userId === currentUserId;

  return (
    <article className="rounded-xl p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-1 text-base font-semibold text-gray-900">
            {review.userName}
          </div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 sm:text-sm">
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>
        {isOwnReview && (
          <button
            type="button"
            onClick={() => onEdit(review)}
            className={`ml-4 shrink-0 ${STOREFRONT_SKY_ACTION_BUTTON_CLASS}`}
          >
            Edit
          </button>
        )}
      </div>
      <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700 sm:text-base">
        {review.comment}
      </p>
    </article>
  );
}




