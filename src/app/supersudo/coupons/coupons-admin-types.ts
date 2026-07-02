export type PromoFormFields = {
  code: string;
  description: string;
  discountType: 'percent' | 'fixed';
  discountValue: string;
  usageLimit: string;
  active: boolean;
  validFrom: string;
  validUntil: string;
  allowedUserIds: string[];
};
