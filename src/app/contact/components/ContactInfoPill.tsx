import Image from 'next/image';
import type { ReactNode } from 'react';
import {
  CONTACT_PILL_ICON_BG_SRC,
  CONTACT_PILL_ARROW_BODY_CLASS,
  CONTACT_PILL_ARROW_HOST_CLASS,
  CONTACT_PILL_SHELL_CLASS,
  CONTACT_PILL_TEXT_CLASS,
} from '../contact-page.constants';

type ContactInfoPillProps = {
  iconSrc: string;
  iconAlt: string;
  children: ReactNode;
  href?: string;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  /** Adds a right-pointing callout tail — Figma location pill. */
  arrowTail?: 'right';
};

const CONTACT_PILL_ICON_CLASS = 'relative z-10 size-8 object-contain';

function PillIcon({
  iconSrc,
  iconAlt,
  iconClassName = CONTACT_PILL_ICON_CLASS,
}: Pick<ContactInfoPillProps, 'iconSrc' | 'iconAlt' | 'iconClassName'>) {
  return (
    <span className="relative flex size-12 shrink-0 items-center justify-center">
      <Image
        src={CONTACT_PILL_ICON_BG_SRC}
        alt=""
        aria-hidden
        width={48}
        height={48}
        className="absolute inset-0 size-12"
      />
      <Image src={iconSrc} alt={iconAlt} width={35} height={35} className={iconClassName} />
    </span>
  );
}

export function ContactInfoPill({
  iconSrc,
  iconAlt,
  children,
  href,
  className = '',
  textClassName = CONTACT_PILL_TEXT_CLASS,
  iconClassName = CONTACT_PILL_ICON_CLASS,
  arrowTail,
}: ContactInfoPillProps) {
  const shellClassName = [
    CONTACT_PILL_SHELL_CLASS,
    arrowTail === 'right' ? CONTACT_PILL_ARROW_BODY_CLASS : className,
  ]
    .filter(Boolean)
    .join(' ');
  const icon = <PillIcon iconSrc={iconSrc} iconAlt={iconAlt} iconClassName={iconClassName} />;
  const body =
    href ? (
      <a href={href} className={`${shellClassName} transition-opacity hover:opacity-90`}>
        {icon}
        <span className={textClassName}>{children}</span>
      </a>
    ) : (
      <div className={shellClassName}>
        {icon}
        <span className={textClassName}>{children}</span>
      </div>
    );

  if (arrowTail === 'right') {
    return (
      <div className={`${CONTACT_PILL_ARROW_HOST_CLASS} relative inline-flex ${className}`}>
        {body}
      </div>
    );
  }

  return body;
}
