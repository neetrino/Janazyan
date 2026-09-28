/** Default ArmSoft SalesManagement API base (no trailing slash). */
export const ARMSOFT_SM_DEFAULT_BASE_URL = "https://api.armsoft.am/sm";

/** Remainders report page size (ArmSoft allows nullable pageSize). */
export const ARMSOFT_REMAINDERS_PAGE_SIZE = 200;

/** Max next-page loops to avoid infinite pagination. */
export const ARMSOFT_REMAINDERS_MAX_PAGES = 50;

/** Products directory page size. */
export const ARMSOFT_PRODUCTS_PAGE_SIZE = 200;

/** Max next-page loops for products directory. */
export const ARMSOFT_PRODUCTS_MAX_PAGES = 50;

/** Batch size for Prisma stock updates. */
export const ARMSOFT_STOCK_UPDATE_BATCH_SIZE = 25;

/**
 * ProductsOutput document state that posts a warehouse stock-out.
 * state 1 creates the document without changing remainders.
 */
export const ARMSOFT_PRODUCTS_OUTPUT_POSTED_STATE = 2;

/** Shop stock was decremented for this order and is still held locally. */
export const ARMSOFT_STOCK_HELD_EVENT = "shop_stock_held";

/** Warehouse stock-out was created in ArmSoft. */
export const ARMSOFT_STOCK_POSTED_EVENT = "armsoft_stock_posted";

/** Local hold was returned because the sale was not completed. */
export const ARMSOFT_STOCK_RELEASED_EVENT = "armsoft_stock_released";

/** Online methods: post to ArmSoft only after payment is confirmed. */
export const ARMSOFT_DEFERRED_PAYMENT_METHODS = ["arca", "idram"] as const;
