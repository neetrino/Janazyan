'use client';

import { Card } from '@shop/ui';
import { useTranslation } from '../../lib/i18n-client';

/**
 * Delivery Terms page - describes shipping and delivery conditions
 */
export default function DeliveryTermsPage() {
  const { t } = useTranslation();
  return (
    <div className="policy-page">
      <div className="policy-page-inner">
        <h1 className="text-4xl font-bold text-gray-900">{t('delivery-terms.title')}</h1>
        <p className="text-gray-600">
          {t('delivery-terms.lastUpdated')}{' '}
          {new Date().toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="mt-8 space-y-6">
          <Card className="p-6">
            <p className="text-gray-600">{t('delivery-terms.intro.p1')}</p>
            <p className="text-gray-600">{t('delivery-terms.intro.p2')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('delivery-terms.timeframes.title')}</h2>
            <p className="text-gray-600">{t('delivery-terms.timeframes.p1')}</p>
            <p className="text-gray-600">{t('delivery-terms.timeframes.p2')}</p>
            <p className="text-gray-600">{t('delivery-terms.timeframes.p3')}</p>
            <p className="text-gray-600">{t('delivery-terms.timeframes.p4')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('delivery-terms.options.title')}</h2>
            <p className="text-gray-600">{t('delivery-terms.options.description')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('delivery-terms.options.items.standard')}</li>
              <li>{t('delivery-terms.options.items.express')}</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900">{t('delivery-terms.fees.title')}</h2>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('delivery-terms.fees.items.free')}</li>
              <li>{t('delivery-terms.fees.items.yerevan')}</li>
              <li>{t('delivery-terms.fees.items.regions')}</li>
              <li>{t('delivery-terms.fees.items.express')}</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900">{t('delivery-terms.packaging.title')}</h2>
            <p className="text-gray-600">{t('delivery-terms.packaging.p1')}</p>
            <p className="text-gray-600">{t('delivery-terms.packaging.p2')}</p>
            <p className="text-gray-600">{t('delivery-terms.packaging.p3')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('delivery-terms.delays.title')}</h2>
            <p className="text-gray-600">{t('delivery-terms.delays.description')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('delivery-terms.delays.items.weather')}</li>
              <li>{t('delivery-terms.delays.items.transport')}</li>
              <li>{t('delivery-terms.delays.items.holidays')}</li>
              <li>{t('delivery-terms.delays.items.schedule')}</li>
              <li>{t('delivery-terms.delays.items.incomplete')}</li>
            </ul>
            <p className="text-gray-600">{t('delivery-terms.delays.footer')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('delivery-terms.incorrectData.title')}</h2>
            <p className="text-gray-600">{t('delivery-terms.incorrectData.p1')}</p>
            <p className="text-gray-600">{t('delivery-terms.incorrectData.p2')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('delivery-terms.receiving.title')}</h2>
            <p className="text-gray-600">{t('delivery-terms.receiving.description')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('delivery-terms.receiving.items.packaging')}</li>
              <li>{t('delivery-terms.receiving.items.match')}</li>
              <li>{t('delivery-terms.receiving.items.quantity')}</li>
            </ul>
            <p className="text-gray-600">{t('delivery-terms.receiving.p1')}</p>
            <p className="text-gray-600">{t('delivery-terms.receiving.p2')}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
