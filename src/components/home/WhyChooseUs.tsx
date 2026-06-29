'use client';

import { MIRAGE_SECTION_HEADING_CREAM_CLASS } from './mirage-heading-styles';
import { useHomeWhyCards } from './use-home-i18n';
import { useTranslation } from '../../lib/i18n-client';
import { SECTION_CARD_ROW_INSET_CLASS } from '../../lib/layout/storefront-layout.constants';
import type { WhyCardConfig } from './constants';
import type { WhyCardText } from './use-home-i18n';

const NUMBER_POSITION: Record<string, string> = {
  '№ 01': 'left-[20.97%] right-[-13%]',
  '№ 02': 'left-[22.67%] right-[-6%]',
  '№ 03': 'left-[23.94%] right-[-14.52%]',
  '№ 04': 'left-[63.15%] right-[-14.24%]',
};

const WHY_CARD_WIDTH_PX = 328;
const WHY_CARD_HEIGHT_PX = 320;
const WHY_CARD_GAP_PX = 20;

type WhyCardView = WhyCardConfig & WhyCardText;

export function WhyChooseUs() {
  const { t } = useTranslation();
  const cards = useHomeWhyCards();

  return (
    <section
      aria-label={t('home.whyChooseUs.sectionAria')}
      className="relative w-full overflow-hidden py-16 font-armenian md:py-24 lg:h-[588px] lg:py-0"
    >
      <div className="relative mx-auto h-full w-full">
        <h2 className={`text-center ${MIRAGE_SECTION_HEADING_CREAM_CLASS} lg:absolute lg:left-1/2 lg:top-[23px] lg:-translate-x-1/2 lg:whitespace-nowrap`}>
          {t('home.whyChooseUs.title')}
        </h2>

        <div
          className={`mt-12 flex flex-wrap justify-center lg:absolute lg:inset-x-0 lg:top-[124px] lg:mt-0 lg:flex-nowrap ${SECTION_CARD_ROW_INSET_CLASS}`}
          style={{ gap: WHY_CARD_GAP_PX }}
        >
          {cards.map((card) => (
            <Card key={card.cardKey} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ card }: { card: WhyCardView }) {
  const numberPosition =
    NUMBER_POSITION[card.index] ?? 'left-[20%] right-[-10%]';

  return (
    <article
      className="relative shrink-0 overflow-hidden rounded-[24px] bg-white shadow-soft transition-shadow duration-300 hover:shadow-card"
      style={{ width: WHY_CARD_WIDTH_PX, height: WHY_CARD_HEIGHT_PX }}
    >
      <span
        aria-hidden
        className={[
          'pointer-events-none absolute top-[202px] text-[200px] font-bold leading-[160px] tracking-[0.01em]',
          numberPosition,
        ].join(' ')}
        style={{ color: card.numberColor }}
      >
        {card.number}
      </span>

      <p className="absolute left-[8.7%] top-[28px] font-mono text-[11px] font-medium uppercase leading-[16.5px] tracking-[0.2em] text-ink-900">
        {card.index}
      </p>

      <div className="absolute left-[8.7%] right-[8.7%] top-[64.5px] h-[46.188px] text-[22px] uppercase leading-[23.1px] tracking-[-0.035em] text-ink-900">
        <span className="block">{card.titleA}</span>
        <span className="block">{card.titleB}</span>
      </div>

      <p className="absolute left-[8.7%] right-[8.7%] top-[124.69px] text-[13.5px] leading-[20.25px] text-ink-600">
        {card.description}
      </p>
    </article>
  );
}
