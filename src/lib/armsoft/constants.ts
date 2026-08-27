/** Default ArmSoft SalesManagement API base (no trailing slash). */
export const ARMSOFT_SM_DEFAULT_BASE_URL = "https://api.armsoft.am/sm";

/** Remainders report page size (ArmSoft allows nullable pageSize). */
export const ARMSOFT_REMAINDERS_PAGE_SIZE = 200;

/** Max next-page loops to avoid infinite pagination. */
export const ARMSOFT_REMAINDERS_MAX_PAGES = 50;

/** Batch size for Prisma stock updates. */
export const ARMSOFT_STOCK_UPDATE_BATCH_SIZE = 25;
