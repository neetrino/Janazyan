'use client';

import { Card } from '@shop/ui';
import { useTranslation } from '../../lib/i18n-client';

/**
 * Returns page - displays return and exchange policy information
 */
export default function ReturnsPage() {
  const { t } = useTranslation();
  return (
    <div className="policy-page">
      <div className="policy-page-inner">
        <h1 className="text-4xl font-bold text-gray-900">{t('returns.title')}</h1>
        <p className="text-gray-600">
          {t('returns.lastUpdated')}{' '}
          {new Date().toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="mt-8 space-y-6">
          <Card className="p-6">
            <p className="text-gray-600">{t('returns.intro.p1')}</p>
            <p className="text-gray-600">{t('returns.intro.p2')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('returns.exchange.title')}</h2>
            <p className="text-gray-600">{t('returns.exchange.p1')}</p>
            <p className="text-gray-600">{t('returns.exchange.p2')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('returns.exchange.items.unused')}</li>
              <li>{t('returns.exchange.items.unopened')}</li>
              <li>{t('returns.exchange.items.packaging')}</li>
              <li>{t('returns.exchange.items.saleable')}</li>
              <li>{t('returns.exchange.items.seal')}</li>
            </ul>
            <p className="text-gray-600">{t('returns.exchange.p3')}</p>
            <p className="text-gray-600">{t('returns.exchange.p4')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('returns.returns.title')}</h2>
            <p className="text-gray-600">{t('returns.returns.p1')}</p>
            <p className="text-gray-600">{t('returns.returns.p2')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('returns.returns.items.unused')}</li>
              <li>{t('returns.returns.items.unopened')}</li>
              <li>{t('returns.returns.items.undamaged')}</li>
              <li>{t('returns.returns.items.packaging')}</li>
              <li>{t('returns.returns.items.saleable')}</li>
            </ul>
            <p className="text-gray-600">{t('returns.returns.p3')}</p>
            <p className="text-gray-600">{t('returns.returns.p4')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('returns.refunds.title')}</h2>
            <p className="text-gray-600">{t('returns.refunds.p1')}</p>
            <p className="text-gray-600">{t('returns.refunds.p2')}</p>
            <p className="text-gray-600">{t('returns.refunds.p3')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('returns.cancellation.title')}</h2>
            <p className="text-gray-600">{t('returns.cancellation.p1')}</p>
            <p className="text-gray-600">{t('returns.cancellation.p2')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('returns.nonEligible.title')}</h2>
            <p className="text-gray-600">{t('returns.nonEligible.description')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('returns.nonEligible.items.opened')}</li>
              <li>{t('returns.nonEligible.items.used')}</li>
              <li>{t('returns.nonEligible.items.damaged')}</li>
              <li>{t('returns.nonEligible.items.seal')}</li>
              <li>{t('returns.nonEligible.items.custom')}</li>
              <li>{t('returns.nonEligible.items.giftCards')}</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900">{t('returns.damaged.title')}</h2>
            <p className="text-gray-600">{t('returns.damaged.p1')}</p>
            <p className="text-gray-600">{t('returns.damaged.p2')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('returns.damaged.items.orderNumber')}</li>
              <li>{t('returns.damaged.items.proof')}</li>
              <li>{t('returns.damaged.items.photos')}</li>
              <li>{t('returns.damaged.items.description')}</li>
            </ul>
            <p className="text-gray-600">{t('returns.damaged.p3')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('returns.reactions.title')}</h2>
            <p className="text-gray-600">{t('returns.reactions.p1')}</p>
            <p className="text-gray-600">{t('returns.reactions.p2')}</p>
            <p className="text-gray-600">{t('returns.reactions.p3')}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
