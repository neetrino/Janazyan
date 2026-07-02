export type FooterLink = {
  labelKey: string;
  href: string;
};

/** "Ընկերություն" column (Figma node 136:403). */
export const FOOTER_COMPANY: ReadonlyArray<FooterLink> = [
  { labelKey: 'links.shop', href: '/products' },
  { labelKey: 'links.about', href: '/about' },
  { labelKey: 'links.stores', href: '/stores' },
  { labelKey: 'links.faq', href: '/faq' },
  { labelKey: 'links.contact', href: '/contact' },
  { labelKey: 'links.blog', href: '/blog' },
];

/** "Աջակցություն" column (Figma node 136:419). */
export const FOOTER_SUPPORT: ReadonlyArray<FooterLink> = [
  { labelKey: 'links.delivery', href: '/delivery' },
  { labelKey: 'links.returns', href: '/returns' },
  { labelKey: 'links.privacy', href: '/privacy' },
  { labelKey: 'links.terms', href: '/terms' },
];

type FooterContactBase = {
  href: string;
  icon: string;
  /** Intrinsic icon size in px (Figma). */
  iconSize: number;
};

export type FooterContactItem =
  | (FooterContactBase & { label: string; labelKey?: never })
  | (FooterContactBase & { labelKey: string; label?: never });

/** "Կապ մեզ հետ" column with leading icons (Figma node 136:413). */
export const FOOTER_CONTACT: ReadonlyArray<FooterContactItem> = [
  {
    label: 'Janazyan@janazyanprojects.com',
    href: 'mailto:Janazyan@janazyanprojects.com',
    icon: '/figma/footer-contact-mail.svg',
    iconSize: 24,
  },
  {
    labelKey: 'contact.storeLocation',
    href: '/stores',
    icon: '/figma/footer-contact-location.svg',
    iconSize: 22,
  },
  {
    label: '+374 41 402080',
    href: 'tel:+37441402080',
    icon: '/figma/footer-contact-phone.svg',
    iconSize: 23,
  },
];

/** White badge shell shared by all footer payment logos (Figma node 363:588). */
export const FOOTER_PAYMENT_BADGE_HEIGHT_PX = 30;
export const FOOTER_PAYMENT_BADGE_RADIUS_PX = 8;
export const FOOTER_PAYMENTS_GAP_PX = 11;

export type FooterPaymentIconPosition =
  | { type: 'center' }
  | { type: 'offset'; left: number; top: number };

export type FooterPayment = {
  label: string;
  icon: string;
  containerWidth: number;
  iconWidth: number;
  iconHeight: number;
  iconPosition: FooterPaymentIconPosition;
  imageClassName?: string;
};

/** Accepted payment methods (Figma node 363:588). */
export const FOOTER_PAYMENTS: ReadonlyArray<FooterPayment> = [
  {
    label: 'Mastercard',
    icon: '/figma/footer-pay-mastercard.png',
    containerWidth: 73,
    iconWidth: 35,
    iconHeight: 28,
    iconPosition: { type: 'offset', left: 19, top: 0.5 },
  },
  {
    label: 'Arca',
    icon: '/figma/footer-pay-arca.png',
    containerWidth: 74,
    iconWidth: 50,
    iconHeight: 13,
    iconPosition: { type: 'center' },
    imageClassName: 'size-full object-cover',
  },
  {
    label: 'Visa',
    icon: '/figma/footer-pay-visa.png',
    containerWidth: 73,
    iconWidth: 40,
    iconHeight: 14,
    iconPosition: { type: 'center' },
    imageClassName: 'size-full object-contain',
  },
];

export type FooterSocialLink = {
  label: string;
  href: string;
  icon: string;
  variant: 'plum' | 'plain';
};

export const FOOTER_SOCIAL: ReadonlyArray<FooterSocialLink> = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1F624VRkD3/',
    icon: '/figma/footer-social-facebook.svg',
    variant: 'plum',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/janazyan_projects?igsh=bzBlajlueTBzN2tz',
    icon: '/figma/footer-social-instagram.svg',
    variant: 'plum',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@janazyan_projects?_r=1&_t=ZS-9684npAG3CT',
    icon: '/figma/footer-social-telegram.svg',
    variant: 'plain',
  },
];

export const FOOTER_COPYRIGHT_COMPANY = 'NEETRINO IT COMPANY';
