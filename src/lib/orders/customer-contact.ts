import type { Prisma } from "@white-shop/db";

type ContactAddress = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
};

function parseContactAddress(
  value: Prisma.JsonValue | null | undefined,
): ContactAddress | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as ContactAddress;
}

/**
 * Resolve checkout customer contact from linked user, order fields, or address snapshots.
 */
export function resolveOrderCustomerContact(order: {
  customerEmail?: string | null;
  customerPhone?: string | null;
  shippingAddress?: Prisma.JsonValue | null;
  billingAddress?: Prisma.JsonValue | null;
  user?: {
    id?: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
}) {
  const user = order.user ?? null;
  const shipping = parseContactAddress(order.shippingAddress);
  const billing = parseContactAddress(order.billingAddress);

  const firstName =
    user?.firstName?.trim() ||
    shipping?.firstName?.trim() ||
    billing?.firstName?.trim() ||
    "";
  const lastName =
    user?.lastName?.trim() ||
    shipping?.lastName?.trim() ||
    billing?.lastName?.trim() ||
    "";
  const email =
    user?.email?.trim() ||
    order.customerEmail?.trim() ||
    billing?.email?.trim() ||
    "";
  const phone =
    user?.phone?.trim() ||
    order.customerPhone?.trim() ||
    shipping?.phone?.trim() ||
    billing?.phone?.trim() ||
    "";

  return {
    firstName,
    lastName,
    email,
    phone,
    customerId: user?.id ?? null,
  };
}

/**
 * Build billing address snapshot from checkout contact fields.
 */
export function buildCheckoutBillingAddress(params: {
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  shippingAddress?: Record<string, unknown> | null;
}): Record<string, unknown> | null {
  const contact = {
    ...(params.firstName?.trim() ? { firstName: params.firstName.trim() } : {}),
    ...(params.lastName?.trim() ? { lastName: params.lastName.trim() } : {}),
    email: params.email,
    phone: params.phone,
  };

  if (params.shippingAddress && "addressLine1" in params.shippingAddress) {
    return { ...params.shippingAddress, ...contact };
  }

  if (params.firstName?.trim() || params.lastName?.trim()) {
    return contact;
  }

  return null;
}
