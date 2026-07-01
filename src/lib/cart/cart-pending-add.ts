interface PendingAddKey {
  productId: string;
  variantId: string;
}

const pendingAdds = new Map<string, Promise<void>>();

function buildPendingAddKey({ productId, variantId }: PendingAddKey): string {
  return `${productId}:${variantId}`;
}

/**
 * Registers an in-flight authenticated add-to-cart mutation by product/variant.
 */
export function registerPendingCartAdd(
  key: PendingAddKey,
  promise: Promise<void>,
): void {
  pendingAdds.set(buildPendingAddKey(key), promise);
  void promise.finally(() => {
    const mapKey = buildPendingAddKey(key);
    if (pendingAdds.get(mapKey) === promise) {
      pendingAdds.delete(mapKey);
    }
  });
}

/**
 * Waits for a matching in-flight add-to-cart mutation, if one exists.
 */
export async function waitForPendingCartAdd(key: PendingAddKey): Promise<void> {
  const pending = pendingAdds.get(buildPendingAddKey(key));
  if (!pending) {
    return;
  }

  try {
    await pending;
  } catch {
    // Remove flow still proceeds; failed add should not block delete intent.
  }
}
