export type PickupStoreAddress = {
  pickupStoreId: string;
  storeName: string;
  address: string;
};

export function isPickupStoreAddress(value: unknown): value is PickupStoreAddress {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.pickupStoreId === 'string' &&
    typeof record.storeName === 'string' &&
    typeof record.address === 'string'
  );
}
