'use client';

import { Card } from '@shop/ui';
import { useTranslation } from '../../lib/i18n-client';

/**
 * Delivery page - displays shipping and delivery conditions
 */
export default function DeliveryPage() {
  const { t } = useTranslation();
  return (
    <div className="policy-page">
      <div className="policy-page-inner">
        <h1 className="text-4xl font-bold text-gray-900">{t('delivery.title')}</h1>
        <p className="text-gray-600">
          {t('delivery.lastUpdated')}{' '}
          {new Date().toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="mt-8 space-y-6">
          <Card className="p-6">
            <p className="text-gray-600">{t('delivery.intro.p1')}</p>
            <p className="text-gray-600">{t('delivery.intro.p2')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('delivery.timeframes.title')}</h2>
            <p className="text-gray-600">{t('delivery.timeframes.p1')}</p>
            <p className="text-gray-600">{t('delivery.timeframes.p2')}</p>
            <p className="text-gray-600">{t('delivery.timeframes.p3')}</p>
            <p className="text-gray-600">{t('delivery.timeframes.p4')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('delivery.options.title')}</h2>
            <p className="text-gray-600">{t('delivery.options.description')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('delivery.options.items.standard')}</li>
              <li>{t('delivery.options.items.express')}</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900">{t('delivery.fees.title')}</h2>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('delivery.fees.items.free')}</li>
              <li>{t('delivery.fees.items.yerevan')}</li>
              <li>{t('delivery.fees.items.regions')}</li>
              <li>{t('delivery.fees.items.express')}</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900">{t('delivery.packaging.title')}</h2>
            <p className="text-gray-600">{t('delivery.packaging.p1')}</p>
            <p className="text-gray-600">{t('delivery.packaging.p2')}</p>
            <p className="text-gray-600">{t('delivery.packaging.p3')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('delivery.delays.title')}</h2>
            <p className="text-gray-600">{t('delivery.delays.description')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('delivery.delays.items.weather')}</li>
              <li>{t('delivery.delays.items.transport')}</li>
              <li>{t('delivery.delays.items.holidays')}</li>
              <li>{t('delivery.delays.items.schedule')}</li>
              <li>{t('delivery.delays.items.incomplete')}</li>
            </ul>
            <p className="text-gray-600">{t('delivery.delays.footer')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('delivery.incorrectData.title')}</h2>
            <p className="text-gray-600">{t('delivery.incorrectData.p1')}</p>
            <p className="text-gray-600">{t('delivery.incorrectData.p2')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('delivery.receiving.title')}</h2>
            <p className="text-gray-600">{t('delivery.receiving.description')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('delivery.receiving.items.packaging')}</li>
              <li>{t('delivery.receiving.items.match')}</li>
              <li>{t('delivery.receiving.items.quantity')}</li>
            </ul>
            <p className="text-gray-600">{t('delivery.receiving.p1')}</p>
            <p className="text-gray-600">{t('delivery.receiving.p2')}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
