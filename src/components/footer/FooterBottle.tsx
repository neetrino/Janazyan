import { FOOTER_DESKTOP_DECORATION_SRC } from './footer-desktop.constants';
import { FOOTER_BOTTLE_CLASS, FOOTER_BOTTLE_FRAME_CLASS } from './footer-compact.constants';

/** Shampoo still life pinned to the right edge of the footer. */
export function FooterBottle() {
  return (
    <div className={FOOTER_BOTTLE_FRAME_CLASS}>
      <img
        src={FOOTER_DESKTOP_DECORATION_SRC}
        alt=""
        aria-hidden
        className={FOOTER_BOTTLE_CLASS}
      />
    </div>
  );
}
