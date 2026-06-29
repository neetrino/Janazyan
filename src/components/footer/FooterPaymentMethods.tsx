/** Payment method chips — Figma node 363:588 (Mastercard · Arca · Visa). */

const CHIP_CLASS =
  'flex h-[30px] items-center justify-center rounded-[8px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]';

function MastercardLogo() {
  return (
    <svg
      width="35"
      height="22"
      viewBox="0 0 35 22"
      fill="none"
      role="img"
      aria-label="Mastercard"
    >
      <circle cx="13" cy="11" r="9" fill="#EB001B" />
      <circle cx="22" cy="11" r="9" fill="#F79E1B" />
      <path
        d="M17.5 4.2A8.97 8.97 0 0 1 21 11a8.97 8.97 0 0 1-3.5 6.8A8.97 8.97 0 0 1 14 11a8.97 8.97 0 0 1 3.5-6.8Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

function ArcaLogo() {
  return (
    <span className="font-sans text-[15px] font-extrabold tracking-[0.5px] text-[#e4002b]">
      ARCA
    </span>
  );
}

function VisaLogo() {
  return (
    <span className="font-sans text-[15px] font-black italic tracking-[0.5px] text-[#1a1f71]">
      VISA
    </span>
  );
}

export function FooterPaymentMethods({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-[11px] ${className}`}>
      <span className={`${CHIP_CLASS} w-[73px]`}>
        <MastercardLogo />
      </span>
      <span className={`${CHIP_CLASS} w-[74px]`}>
        <ArcaLogo />
      </span>
      <span className={`${CHIP_CLASS} w-[73px]`}>
        <VisaLogo />
      </span>
    </div>
  );
}
