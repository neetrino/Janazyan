'use client';

import { Card } from '@shop/ui';
import { useTranslation } from '../../lib/i18n-client';

/**
 * Privacy Policy page - displays privacy policy information
 */
export default function PrivacyPage() {
  const { t } = useTranslation();
  return (
    <div className="policy-page">
      <div className="policy-page-inner">
        <h1 className="text-4xl font-bold text-gray-900">{t('privacy.title')}</h1>
        <p className="text-gray-600">
          {t('privacy.lastUpdated')}{' '}
          {new Date().toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="mt-8 space-y-6">
          <Card className="p-6">
            <p className="text-gray-600">{t('privacy.intro.p1')}</p>
            <p className="text-gray-600">{t('privacy.intro.p2')}</p>
            <p className="text-gray-600">{t('privacy.intro.p3')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('privacy.collectedData.title')}</h2>
            <p className="text-gray-600">{t('privacy.collectedData.description')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('privacy.collectedData.items.contact')}</li>
              <li>{t('privacy.collectedData.items.purchase')}</li>
              <li>{t('privacy.collectedData.items.technical')}</li>
              <li>{t('privacy.collectedData.items.cookies')}</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900">{t('privacy.useOfData.title')}</h2>
            <p className="text-gray-600">{t('privacy.useOfData.description')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('privacy.useOfData.items.orders')}</li>
              <li>{t('privacy.useOfData.items.support')}</li>
              <li>{t('privacy.useOfData.items.improve')}</li>
              <li>{t('privacy.useOfData.items.legal')}</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900">{t('privacy.retention.title')}</h2>
            <p className="text-gray-600">{t('privacy.retention.description')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('privacy.retention.items.account')}</li>
              <li>{t('privacy.retention.items.purchaseHistory')}</li>
              <li>{t('privacy.retention.items.marketing')}</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900">{t('privacy.security.title')}</h2>
            <p className="text-gray-600">{t('privacy.security.description')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('privacy.security.items.ssl')}</li>
              <li>{t('privacy.security.items.access')}</li>
              <li>{t('privacy.security.items.audits')}</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900">{t('privacy.thirdParties.title')}</h2>
            <p className="text-gray-600">{t('privacy.thirdParties.description')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('privacy.thirdParties.items.shipping')}</li>
              <li>{t('privacy.thirdParties.items.payment')}</li>
              <li>{t('privacy.thirdParties.items.law')}</li>
            </ul>
            <p className="text-gray-600">{t('privacy.thirdParties.footer')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('privacy.userRights.title')}</h2>
            <p className="text-gray-600">{t('privacy.userRights.description')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('privacy.userRights.items.copy')}</li>
              <li>{t('privacy.userRights.items.edit')}</li>
              <li>{t('privacy.userRights.items.optOut')}</li>
              <li>{t('privacy.userRights.items.restrict')}</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900">{t('privacy.cookies.title')}</h2>
            <p className="text-gray-600">{t('privacy.cookies.description')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('privacy.cookies.items.functional')}</li>
              <li>{t('privacy.cookies.items.analytical')}</li>
              <li>{t('privacy.cookies.items.marketing')}</li>
            </ul>
            <p className="text-gray-600">{t('privacy.cookies.note')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('privacy.changes.title')}</h2>
            <p className="text-gray-600">{t('privacy.changes.description')}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
