/** Checkout phone: optional leading +, 8–15 digits. */
export const CHECKOUT_PHONE_PATTERN = /^\+?[0-9]{8,15}$/;

export type OptionalCheckoutPhoneResult =
  | { ok: true; phone: string | null }
  | { ok: false };

/** Empty or missing is valid. A filled value must match the checkout phone pattern. */
export function parseOptionalCheckoutPhone(value: unknown): OptionalCheckoutPhoneResult {
  if (value == null) {
    return { ok: true, phone: null };
  }

  if (typeof value !== 'string') {
    return { ok: false };
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: true, phone: null };
  }

  if (!CHECKOUT_PHONE_PATTERN.test(trimmed)) {
    return { ok: false };
  }

  return { ok: true, phone: trimmed };
}
