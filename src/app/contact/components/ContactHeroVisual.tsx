'use client';

import Image from 'next/image';
import { ContactInfoPill } from './ContactInfoPill';
import {
  CONTACT_HERO_FRAME_CLASS,
  CONTACT_HERO_IMAGE_CLASS,
  CONTACT_HERO_IMAGE_RADIUS_CLASS,
  CONTACT_HERO_IMAGE_SRC,
  CONTACT_HERO_WALL_BLEED_CLASS,
  CONTACT_HERO_WIDTH_PX,
  CONTACT_PILL_EMAIL_POSITION_CLASS,
  CONTACT_PILL_LOCATION_ICON_CLASS,
  CONTACT_PILL_LOCATION_ICON_SRC,
  CONTACT_PILL_LOCATION_POSITION_CLASS,
  CONTACT_PILL_LOCATION_TEXT_CLASS,
  CONTACT_PILL_MAIL_ICON_SRC,
  CONTACT_PILL_PHONE_ICON_SRC,
  CONTACT_PILL_PHONE_POSITION_CLASS,
  CONTACT_PILL_TIME_ACCENT_CLASS,
  CONTACT_PILL_TIME_ICON_SRC,
  CONTACT_PILL_TIME_POSITION_CLASS,
  CONTACT_PILL_TIME_SATURDAY_LINE_CLASS,
  CONTACT_PILL_TIME_TEXT_CLASS,
  CONTACT_PILL_TIME_WEEKDAYS_LINE_CLASS,
} from '../contact-page.constants';
import { useTranslation } from '../../../lib/i18n-client';

export function ContactHeroVisual() {
  const { t } = useTranslation();
  const phoneLabel = t('contact.phone');
  const phoneHref = phoneLabel.replace(/\s+/g, '');
  const email = t('contact.email');

  return (
    <div className={`relative ${CONTACT_HERO_WALL_BLEED_CLASS}`}>
      <div className={`${CONTACT_HERO_FRAME_CLASS} ${CONTACT_HERO_IMAGE_RADIUS_CLASS}`}>
        <Image
          src={CONTACT_HERO_IMAGE_SRC}
          alt=""
          fill
          priority
          sizes={`(max-width: 1024px) 100vw, ${CONTACT_HERO_WIDTH_PX}px`}
          className={CONTACT_HERO_IMAGE_CLASS}
        />
      </div>

      <div className="absolute inset-0 mt-0">
        <ContactInfoPill
          iconSrc={CONTACT_PILL_PHONE_ICON_SRC}
          iconAlt={t('contact.callToUs.title')}
          href={`tel:${phoneHref}`}
          className={CONTACT_PILL_PHONE_POSITION_CLASS}
        >
          {phoneLabel}
        </ContactInfoPill>

        <ContactInfoPill
          iconSrc={CONTACT_PILL_MAIL_ICON_SRC}
          iconAlt={t('contact.writeToUs.title')}
          href={`mailto:${email}`}
          className={CONTACT_PILL_EMAIL_POSITION_CLASS}
        >
          {email}
        </ContactInfoPill>

        <ContactInfoPill
          iconSrc={CONTACT_PILL_LOCATION_ICON_SRC}
          iconAlt={t('contact.headquarter.title')}
          iconClassName={CONTACT_PILL_LOCATION_ICON_CLASS}
          className={CONTACT_PILL_LOCATION_POSITION_CLASS}
          textClassName={CONTACT_PILL_LOCATION_TEXT_CLASS}
          arrowTail="right"
        >
          {t('contact.address')}
        </ContactInfoPill>

        <ContactInfoPill
          iconSrc={CONTACT_PILL_TIME_ICON_SRC}
          iconAlt={t('contact.headquarter.title')}
          className={CONTACT_PILL_TIME_POSITION_CLASS}
          textClassName={CONTACT_PILL_TIME_TEXT_CLASS}
        >
          <span className={CONTACT_PILL_TIME_WEEKDAYS_LINE_CLASS}>
            {t('contact.headquarter.hours.weekdaysLabel')}{' '}
            <span className={CONTACT_PILL_TIME_ACCENT_CLASS}>
              {t('contact.headquarter.hours.weekdaysTime')}
            </span>
          </span>
          <span className={CONTACT_PILL_TIME_SATURDAY_LINE_CLASS}>
            {t('contact.headquarter.hours.saturdayLabel')}{' '}
            <span className={CONTACT_PILL_TIME_ACCENT_CLASS}>
              {t('contact.headquarter.hours.saturdayTime')}
            </span>
          </span>
        </ContactInfoPill>
      </div>
    </div>
  );
}
