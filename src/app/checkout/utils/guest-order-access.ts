const STORAGE_PREFIX = 'guest-order-access:';
const GUEST_ORDER_ACCESS_TTL_MS = 24 * 60 * 60 * 1000;

interface GuestOrderAccess {
  email: string;
  phone: string;
  expiresAt: number;
}

export function saveGuestOrderAccess(
  orderNumber: string,
  email: string,
  phone: string,
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const payload: GuestOrderAccess = {
    email,
    phone,
    expiresAt: Date.now() + GUEST_ORDER_ACCESS_TTL_MS,
  };

  sessionStorage.setItem(`${STORAGE_PREFIX}${orderNumber}`, JSON.stringify(payload));
}

export function readGuestOrderAccess(orderNumber: string): GuestOrderAccess | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${orderNumber}`);
    if (!raw) {
      return null;
    }

    const payload = JSON.parse(raw) as GuestOrderAccess;
    if (
      !payload.email ||
      !payload.phone ||
      typeof payload.expiresAt !== 'number' ||
      payload.expiresAt < Date.now()
    ) {
      sessionStorage.removeItem(`${STORAGE_PREFIX}${orderNumber}`);
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
