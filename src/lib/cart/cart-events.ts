export type CartUpdatedDetail = {
  itemsCount?: number;
  skipRevalidate?: boolean;
  fromSync?: boolean;
  /** Optimistic or confirmed local mutation — never trigger background revalidate. */
  fromMutation?: boolean;
};

/** Broadcast cart UI changes to header badge, drawer, and checkout hooks. */
export function dispatchCartUpdated(detail: CartUpdatedDetail = {}): void {
  window.dispatchEvent(
    new CustomEvent('cart-updated', {
      detail: {
        skipRevalidate: true,
        ...detail,
      },
    }),
  );
}

export function parseCartUpdatedDetail(event: Event): CartUpdatedDetail | null {
  if (!(event instanceof CustomEvent)) {
    return null;
  }
  const raw = event.detail;
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  return raw as CartUpdatedDetail;
}
