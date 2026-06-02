import { WHY_CARDS, type WhyCard } from './constants';

const NUMBER_POSITION: Record<WhyCard['index'], string> = {
  '№ 01': 'left-[20.97%] right-[-13%]',
  '№ 02': 'left-[22.67%] right-[-6%]',
  '№ 03': 'left-[23.94%] right-[-14.52%]',
  '№ 04': 'left-[63.15%] right-[-14.24%]',
};

export function WhyChooseUs() {
  return (
    <section
      aria-label="Why choose us"
      className="relative w-full px-4 py-16 font-armenian sm:px-6 md:px-8 lg:px-[58px] md:py-24 lg:h-[588px] lg:py-0"
    >
      <div className="relative mx-auto h-full w-full">
        <h2 className="text-center font-display text-[clamp(34px,5vw,66px)] font-normal leading-[40px] tracking-[0.3691px] text-cream lg:absolute lg:left-1/2 lg:top-[23px] lg:-translate-x-1/2 lg:whitespace-nowrap">
          Ինչու Ընտրել Մեզ
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:absolute lg:left-1/2 lg:top-[124px] lg:mt-0 lg:flex lg:w-[1372px] lg:max-w-full lg:-translate-x-1/2 lg:gap-[20px]">
          {WHY_CARDS.map((card) => (
            <Card key={card.index} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ card }: { card: WhyCard }) {
  return (
    <article className="relative h-[320px] w-full overflow-hidden rounded-[24px] bg-white shadow-soft transition-shadow duration-300 hover:shadow-card lg:w-[328px] lg:shrink-0">
      <span
        aria-hidden
        className={[
          'pointer-events-none absolute top-[202px] text-[200px] font-bold leading-[160px] tracking-[0.01em]',
          NUMBER_POSITION[card.index],
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
