import Image from 'next/image';
import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import {
  FOOTER_CONTACTS,
  FOOTER_POLICIES,
  FOOTER_QUICK_LINKS,
} from './constants';

export function HomeFooter() {
  return (
    <footer className="relative w-full px-2 sm:px-3 md:px-0">
      <div className="relative mx-auto min-h-[441px] w-full overflow-hidden bg-purple text-white rounded-t-[32px] md:rounded-t-[60px] lg:h-[441px]">
        {/* Right decoration */}
        <div className="pointer-events-none absolute right-0 -top-[30%] hidden h-[180%] w-[40%] md:block">
          <Image
            src="/figma/footer-decoration.png"
            alt=""
            fill
            sizes="40vw"
            className="object-contain object-right"
          />
        </div>

        <div className="relative mx-auto grid w-full max-w-[1470px] gap-10 px-6 py-14 sm:px-10 md:grid-cols-2 md:gap-12 md:py-[125px] lg:absolute lg:left-1/2 lg:top-[125px] lg:-translate-x-1/2 lg:grid-cols-[284px_192px_321px_284px] lg:gap-0 lg:px-[62px] lg:py-0">
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="relative block h-[42px] w-[150px]">
                <Image
                  src="/figma/footer-logo.png"
                  alt="Janazyan"
                  fill
                  sizes="150px"
                  className="object-contain object-left"
                />
              </span>
            </Link>
            <p className="max-w-[284px] text-[16px] leading-[24px] tracking-[-0.02em] text-white/95">
              Նուրբ խնամք Ձեր փոքրիկի համար՝ ստեղծված սիրով և ուշադրությամբ յուրաքանչյուր մանրուքի նկատմամբ։
            </p>
            <div className="flex items-center gap-3">
              <SocialLink href="#" label="Facebook">
                <Facebook className="h-5 w-5" strokeWidth={2} />
              </SocialLink>
              <SocialLink href="#" label="Instagram">
                <Instagram className="h-5 w-5" strokeWidth={2} />
              </SocialLink>
              <SocialLink href="#" label="Twitter" plain>
                <Twitter className="h-5 w-5 text-white" strokeWidth={2} />
              </SocialLink>
            </div>
          </div>

          <FooterColumn title="Արագ Հղումներ">
            {FOOTER_QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[16px] leading-[24px] tracking-[-0.02em] text-white/95 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Հաճախորդների Սպասարկում">
            {FOOTER_POLICIES.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[14px] leading-[20px] text-white/90 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Կապ Մեզ Հետ">
            {FOOTER_CONTACTS.map((c) => {
              const Icon =
                c.icon === 'pin'
                  ? MapPin
                  : c.icon === 'phone'
                    ? Phone
                    : Mail;
              return (
                <li key={c.text} className="flex items-center gap-3">
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
                  {c.href ? (
                    <Link
                      href={c.href}
                      className="text-[16px] leading-[24px] text-white/95 transition-colors hover:text-white"
                    >
                      {c.text}
                    </Link>
                  ) : (
                    <span className="text-[16px] leading-[24px] text-white/95">
                      {c.text}
                    </span>
                  )}
                </li>
              );
            })}
          </FooterColumn>
        </div>

        <div className="relative mx-auto w-full max-w-[1470px] px-6 pb-6 sm:px-10 lg:absolute lg:left-1/2 lg:top-[369px] lg:-translate-x-1/2 lg:px-[62px] lg:pb-0">
          <p className="text-[14px] text-white/90">
            © 2026 NAME։ Բոլոր իրավունքները պաշտպանված են։
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[16px] font-medium leading-[24px] tracking-[-0.02em]">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">{children}</ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
  plain = false,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  plain?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={[
        'grid h-10 w-10 place-items-center rounded-full transition-transform hover:scale-105',
        plain
          ? 'bg-transparent text-white'
          : 'bg-white text-purple',
      ].join(' ')}
    >
      {children}
    </Link>
  );
}
