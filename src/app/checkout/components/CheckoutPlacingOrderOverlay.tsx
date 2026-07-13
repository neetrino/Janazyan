'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BrandCenteredLoaderMark } from '../../../components/BrandCenteredLoaderMark';
import {
  BRAND_CENTERED_LOADER_OVERLAY_CLASS,
  BRAND_CENTERED_LOADER_PANEL_CLASS,
} from '../../../components/brand-centered-loader.constants';
import { useTranslation } from '../../../lib/i18n-client';

type CheckoutPlacingOrderOverlayProps = {
  open: boolean;
};

export function CheckoutPlacingOrderOverlay({ open }: CheckoutPlacingOrderOverlayProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!mounted || !open) {
    return null;
  }

  const label = t('checkout.buttons.processing');

  return createPortal(
    <div
      className={BRAND_CENTERED_LOADER_OVERLAY_CLASS}
      role="alertdialog"
      aria-busy="true"
      aria-live="assertive"
      aria-label={label}
    >
      <div className={BRAND_CENTERED_LOADER_PANEL_CLASS}>
        <BrandCenteredLoaderMark label={label} />
      </div>
    </div>,
    document.body,
  );
}
