import type { FieldErrors } from 'react-hook-form';
import type { CheckoutFormData } from '../types';

export const CHECKOUT_FORM_ID = 'checkout-form';

const MOBILE_VIEWPORT_MAX_WIDTH_PX = 1023;

/** Delay before focus after scroll (error message paint). */
const CHECKOUT_ERROR_FOCUS_DELAY_MS = 80;
/** Second pass after validation UI paints (stabilizes mobile behavior). */
const CHECKOUT_ERROR_SCROLL_SECOND_PASS_DELAY_MS = 120;

/** Clearance below mobile top bar when scrolling to a field. */
const MOBILE_CHECKOUT_SCROLL_TOP_OFFSET_PX = 96;

export const CHECKOUT_VALIDATION_FIELD_ORDER: (keyof CheckoutFormData)[] = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'shippingMethod',
  'shippingCity',
  'shippingAddress',
  'paymentMethod',
];

const CHECKOUT_FIELD_SECTION_SELECTOR: Partial<Record<keyof CheckoutFormData, string>> = {
  shippingMethod: '[data-checkout-section="shipping-method"]',
  shippingCity: '[data-shipping-section]',
  shippingAddress: '[data-shipping-section]',
  paymentMethod: '[data-checkout-section="payment-method"]',
};

type ScrollToCheckoutErrorOptions = {
  /** Scroll in the same user-gesture tick (required on mobile Safari). */
  immediate?: boolean;
};

function isMobileCheckoutViewport(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia(`(max-width: ${MOBILE_VIEWPORT_MAX_WIDTH_PX}px)`).matches
  );
}

function findFirstCheckoutValidationError(
  validationErrors: FieldErrors<CheckoutFormData>,
): keyof CheckoutFormData | null {
  for (const fieldName of CHECKOUT_VALIDATION_FIELD_ORDER) {
    if (validationErrors[fieldName]) {
      return fieldName;
    }
  }

  const fallbackKey = Object.keys(validationErrors)[0] as keyof CheckoutFormData | undefined;
  return fallbackKey ?? null;
}

function getCheckoutFormRoot(): HTMLElement | Document {
  return document.getElementById(CHECKOUT_FORM_ID) ?? document;
}

function resolveCheckoutErrorTarget(fieldName: keyof CheckoutFormData): HTMLElement | null {
  const root = getCheckoutFormRoot();

  const byFieldMarker = root.querySelector<HTMLElement>(`[data-checkout-field="${fieldName}"]`);
  if (byFieldMarker) {
    return byFieldMarker;
  }

  const namedInput = root.querySelector<HTMLElement>(`[name="${fieldName}"]`);
  if (namedInput) {
    return (
      namedInput.closest<HTMLElement>('[data-checkout-field]') ??
      namedInput.parentElement ??
      namedInput
    );
  }

  const sectionSelector = CHECKOUT_FIELD_SECTION_SELECTOR[fieldName];
  if (sectionSelector) {
    return root.querySelector<HTMLElement>(sectionSelector);
  }

  return null;
}

function focusCheckoutInput(target: HTMLElement): void {
  const focusable = target.querySelector<HTMLElement>(
    'input:not([type="radio"]):not([type="checkbox"]), textarea, select',
  );

  if (focusable instanceof HTMLElement) {
    focusable.focus({ preventScroll: true });
  }
}

function scrollCheckoutTargetIntoView(target: HTMLElement, immediate: boolean): void {
  const topOffset = isMobileCheckoutViewport() ? MOBILE_CHECKOUT_SCROLL_TOP_OFFSET_PX : 80;
  const scrollTop = Math.max(0, window.scrollY + target.getBoundingClientRect().top - topOffset);
  const behavior = immediate || isMobileCheckoutViewport() ? 'auto' : 'smooth';

  window.scrollTo({ top: scrollTop, behavior });

  const scrollingElement = document.scrollingElement;
  if (scrollingElement instanceof HTMLElement) {
    scrollingElement.scrollTop = scrollTop;
  }
}

function performCheckoutErrorScroll(
  validationErrors: FieldErrors<CheckoutFormData>,
  immediate: boolean,
): void {
  const firstErrorField = findFirstCheckoutValidationError(validationErrors);
  if (!firstErrorField) {
    return;
  }

  const target = resolveCheckoutErrorTarget(firstErrorField);
  if (!target) {
    return;
  }

  scrollCheckoutTargetIntoView(target, immediate);
  window.setTimeout(() => focusCheckoutInput(target), CHECKOUT_ERROR_FOCUS_DELAY_MS);
}

/** Scroll to the first invalid checkout field — mobile scrolls up from the summary CTA. */
export function scrollToFirstCheckoutError(
  validationErrors: FieldErrors<CheckoutFormData>,
  options?: ScrollToCheckoutErrorOptions,
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const immediate = options?.immediate ?? false;

  if (immediate) {
    performCheckoutErrorScroll(validationErrors, true);
    window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        performCheckoutErrorScroll(validationErrors, false);
      });
    }, CHECKOUT_ERROR_SCROLL_SECOND_PASS_DELAY_MS);
    return;
  }

  window.requestAnimationFrame(() => {
    performCheckoutErrorScroll(validationErrors, false);
  });
}
