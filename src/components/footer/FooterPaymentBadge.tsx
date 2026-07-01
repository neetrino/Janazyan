import type { FooterPayment } from './constants';
import {
  FOOTER_PAYMENT_BADGE_HEIGHT_PX,
  FOOTER_PAYMENT_BADGE_RADIUS_PX,
} from './constants';

type FooterPaymentBadgeProps = {
  payment: FooterPayment;
};

export function FooterPaymentBadge({ payment }: FooterPaymentBadgeProps) {
  const { label, icon, containerWidth, iconWidth, iconHeight, iconPosition } =
    payment;

  return (
    <div
      className="relative shrink-0 overflow-hidden bg-white"
      style={{
        width: containerWidth,
        height: FOOTER_PAYMENT_BADGE_HEIGHT_PX,
        borderRadius: FOOTER_PAYMENT_BADGE_RADIUS_PX,
      }}
    >
      <PaymentBadgeIcon
        label={label}
        icon={icon}
        iconWidth={iconWidth}
        iconHeight={iconHeight}
        iconPosition={iconPosition}
        imageClassName={payment.imageClassName}
      />
    </div>
  );
}

function PaymentBadgeIcon({
  label,
  icon,
  iconWidth,
  iconHeight,
  iconPosition,
  imageClassName,
}: Pick<
  FooterPayment,
  'icon' | 'iconWidth' | 'iconHeight' | 'iconPosition' | 'imageClassName'
> & { label: string }) {
  if (iconPosition.type === 'offset') {
    return (
      <div
        className="absolute overflow-hidden"
        style={{
          left: iconPosition.left,
          top: iconPosition.top,
          width: iconWidth,
          height: iconHeight,
        }}
      >
        <img
          src={icon}
          alt={label}
          width={iconWidth}
          height={iconHeight}
          className={
            imageClassName ??
            'absolute left-0 top-[4.97%] h-[95.93%] w-full max-w-none'
          }
        />
      </div>
    );
  }

  const centeredFrameClassName =
    'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden';

  return (
    <div
      className={centeredFrameClassName}
      style={{ width: iconWidth, height: iconHeight }}
    >
      <img
        src={icon}
        alt={label}
        width={iconWidth}
        height={iconHeight}
        className={imageClassName ?? 'size-full object-cover'}
      />
    </div>
  );
}
