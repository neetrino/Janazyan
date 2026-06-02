export type FooterLink = {
  label: string;
  href: string;
};

export const FOOTER_PURCHASES: ReadonlyArray<FooterLink> = [
  { label: 'Բոլոր ապրանքները', href: '/products' },
  { label: 'Բեսթսելլերներ', href: '/products?sort=bestsellers' },
  { label: 'Նոր թողարկում', href: '/products?sort=new' },
  { label: 'Փաթեթներ', href: '/products?category=packages' },
  { label: 'Նվեր քարտեր', href: '/gift-cards' },
];

export const FOOTER_SUPPORT: ReadonlyArray<FooterLink> = [
  { label: 'Կապ մեզ հետ', href: '/contact' },
  { label: 'Առաքում', href: '/delivery' },
  { label: 'Վերադարձ', href: '/returns' },
  { label: 'Հաճախ տրվող հարցեր', href: '/faq' },
  { label: '+374 11 234 567', href: 'tel:+37411234567' },
];

export const FOOTER_BRAND: ReadonlyArray<FooterLink> = [
  { label: 'Մեր մասին', href: '/about' },
  { label: 'Բաղադրիչներ', href: '/ingredients' },
  { label: 'Կայունություն', href: '/sustainability' },
  { label: 'Բլոգ', href: '/blog' },
  { label: 'Մամուլ', href: '/press' },
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
