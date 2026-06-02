'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, User } from 'lucide-react';
import { HOME_NAV_LINKS } from './home/constants';

const NAV_LINKS = HOME_NAV_LINKS;

function HeaderLogo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Janazyan Home">
      <span className="relative h-[42px] w-[42px] sm:h-[54px] sm:w-[54px] md:h-[66px] md:w-[79px]">
        <Image
          src="/figma/header-logo.png"
          alt="Janazyan"
          fill
          priority
          sizes="80px"
          className="object-contain"
        />
      </span>
    </Link>
  );
}

function HeaderNav({ pathname }: { pathname: string }) {
  return (
    <nav className="hidden items-center gap-6 lg:flex xl:gap-[24px]">
      {NAV_LINKS.map((link, index) => {
        const isActive = link.active ?? pathname === link.href;
        return (
          <Link
            key={`${link.href}-${index}`}
            href={link.href}
            className={[
              'relative inline-flex items-center text-[16px] font-semibold leading-6 tracking-[-0.01em] transition-colors duration-200',
              isActive ? 'text-white' : 'text-ink-500 hover:text-ink-800',
            ].join(' ')}
          >
            {isActive && (
              <span className="absolute -inset-x-3 -inset-y-1.5 -z-10 rounded-full bg-sky" />
            )}
            <span className="relative">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function HeaderActions() {
  return (
    <div className="flex items-center gap-4 rounded-full bg-[#f8f8f8] px-4 py-2 sm:px-[22px] sm:py-[10px]">
      <button
        type="button"
        aria-label="Search"
        className="grid h-5 w-5 place-items-center rounded-full text-ink-700 transition-colors hover:text-sky-deep"
      >
        <Search className="h-5 w-5" strokeWidth={1.9} />
      </button>
      <button
        type="button"
        aria-label="Account"
        className="grid h-5 w-5 place-items-center rounded-full text-ink-700 transition-colors hover:text-sky-deep"
      >
        <User className="h-5 w-5" strokeWidth={1.9} />
      </button>
      <Link
        href="/cart"
        aria-label="Cart"
        className="relative grid h-5 w-5 place-items-center rounded-full text-ink-700 transition-colors hover:text-sky-deep"
      >
        <ShoppingBag className="h-5 w-5" strokeWidth={1.9} />
        <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[#0499c3] px-1 text-[10px] font-medium text-white">
          0
        </span>
      </Link>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-safe-top px-4 pb-3 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] sm:px-6 md:px-8 lg:px-[58px]">
      <div className="mx-auto flex w-full items-center justify-between gap-3 rounded-[24px] bg-white px-4 py-3 shadow-soft sm:px-5 md:px-6 lg:rounded-[28px] lg:px-7">
        <HeaderLogo />
        <HeaderNav pathname={pathname} />
        <HeaderActions />
      </div>
    </header>
  );
}
