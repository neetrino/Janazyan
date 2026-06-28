export type FooterLink = {
  label: string;
  href: string;
};

/** Footer column titles (rendered uppercase via CSS) — Figma node 136:402. */
export const FOOTER_COLUMN_TITLES = {
  company: 'Ընկերություն',
  contact: 'Կապ մեզ հետ',
  support: 'Աջակցություն',
} as const;

/** Column 1 "Ընկերություն" — Figma node 136:403. */
export const FOOTER_COMPANY_LINKS: ReadonlyArray<FooterLink> = [
  { label: 'Խանութ', href: '/products' },
  { label: 'Մեր մասին', href: '/about' },
  { label: 'Մեր խանութները', href: '/stores' },
  { label: 'Հարցեր', href: '/faq' },
  { label: 'Կապ', href: '/contact' },
  { label: 'Բլոգ', href: '/blog' },
];

/** Column 3 "Աջակցություն" — Figma node 136:419. */
export const FOOTER_SUPPORT_LINKS: ReadonlyArray<FooterLink> = [
  { label: 'Առաքում', href: '/delivery' },
  { label: 'Վերադարձ', href: '/returns' },
  { label: 'Գաղտնիություն', href: '/privacy' },
  { label: 'Պայմաններ և դրույթներ', href: '/terms' },
];

export type FooterContactType = 'email' | 'address' | 'phone';

export type FooterContactItem = {
  type: FooterContactType;
  label: string;
  href?: string;
};

/** Contact block "Կապ մեզ հետ" — Figma node 136:413. */
export const FOOTER_CONTACT: ReadonlyArray<FooterContactItem> = [
  {
    type: 'email',
    label: 'infojanazyan@mail.com',
    href: 'mailto:infojanazyan@mail.com',
  },
  { type: 'address', label: 'Megamall, 2-րդ հարկ' },
  { type: 'phone', label: '+374 11 234 567', href: 'tel:+37411234567' },
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
    href: '#',
    icon: '/figma/footer-social-facebook.svg',
    variant: 'plum',
  },
  {
    label: 'Instagram',
    href: '#',
    icon: '/figma/footer-social-instagram.svg',
    variant: 'plum',
  },
  {
    label: 'Telegram',
    href: '#',
    icon: '/figma/footer-social-telegram.svg',
    variant: 'plain',
  },
];

export const FOOTER_COPYRIGHT_COMPANY = 'NEETRINO IT COMPANY';
