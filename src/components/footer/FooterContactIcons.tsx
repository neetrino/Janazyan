import type { FooterContactType } from './constants';

type IconProps = {
  className?: string;
};

/** mynaui:mail — Figma node 358:510 */
function MailIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 6.5 4.8a2.5 2.5 0 0 0 3 0L20 7" />
    </svg>
  );
}

/** proicons:location — Figma node 358:514 */
function LocationIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 20s6.5-5.4 6.5-10.5a6.5 6.5 0 1 0-13 0C4.5 14.6 11 20 11 20Z" />
      <circle cx="11" cy="9.5" r="2.4" />
    </svg>
  );
}

/** solar:phone-outline — Figma node 358:512 */
function PhoneIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5.2 4.3c.4-.4 1-.5 1.5-.2l2 1.2c.5.3.7 1 .5 1.6l-.7 1.8c-.2.5-.1 1 .3 1.4l2.6 2.6c.4.4.9.5 1.4.3l1.8-.7c.6-.2 1.3 0 1.6.5l1.2 2c.3.5.2 1.1-.2 1.5l-1 1c-.7.7-1.7 1-2.6.7C11 21.7 8.4 20 6.2 17.8 4 15.6 2.3 13 1.2 9.8c-.3-.9 0-1.9.7-2.6Z" />
    </svg>
  );
}

export function FooterContactIcon({
  type,
  className,
}: {
  type: FooterContactType;
  className?: string;
}) {
  if (type === 'email') {
    return <MailIcon className={className} />;
  }
  if (type === 'address') {
    return <LocationIcon className={className} />;
  }
  return <PhoneIcon className={className} />;
}
