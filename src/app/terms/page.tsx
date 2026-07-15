'use client';

import { Card } from '@shop/ui';
import { useTranslation } from '../../lib/i18n-client';

/**
 * Terms of Service page - displays terms and conditions
 */
export default function TermsPage() {
  const { t } = useTranslation();
  return (
    <div className="policy-page">
      <div className="policy-page-inner">
        <h1 className="text-4xl font-bold text-gray-900">{t('terms.title')}</h1>
        <p className="text-gray-600">
          {t('terms.lastUpdated')}{' '}
          {new Date().toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="mt-8 space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900">{t('terms.general.title')}</h2>
            <p className="text-gray-600">{t('terms.general.p1')}</p>
            <p className="text-gray-600">{t('terms.general.p2')}</p>
            <p className="text-gray-600">{t('terms.general.p3')}</p>
            <p className="text-gray-600">{t('terms.general.p4')}</p>
            <p className="text-gray-600">{t('terms.general.p5')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('terms.definitions.title')}</h2>
            <p className="text-gray-600">{t('terms.definitions.description')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('terms.definitions.items.website')}</li>
              <li>{t('terms.definitions.items.user')}</li>
              <li>{t('terms.definitions.items.services')}</li>
              <li>{t('terms.definitions.items.content')}</li>
              <li>{t('terms.definitions.items.intellectualProperty')}</li>
              <li>{t('terms.definitions.items.transaction')}</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900">{t('terms.userObligations.title')}</h2>
            <p className="text-gray-600">{t('terms.userObligations.p1')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('terms.userObligations.items.lawful')}</li>
              <li>{t('terms.userObligations.items.interfere')}</li>
              <li>{t('terms.userObligations.items.malware')}</li>
              <li>{t('terms.userObligations.items.access')}</li>
              <li>{t('terms.userObligations.items.content')}</li>
            </ul>
            <p className="text-gray-600">{t('terms.userObligations.p2')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('terms.liability.title')}</h2>
            <p className="text-gray-600">{t('terms.liability.p1')}</p>
            <p className="text-gray-600">{t('terms.liability.p2')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('terms.liability.items.errors')}</li>
              <li>{t('terms.liability.items.falseInfo')}</li>
              <li>{t('terms.liability.items.thirdParty')}</li>
              <li>{t('terms.liability.items.content')}</li>
            </ul>
            <p className="text-gray-600">{t('terms.liability.p3')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('terms.intellectualProperty.title')}</h2>
            <p className="text-gray-600">{t('terms.intellectualProperty.p1')}</p>
            <p className="text-gray-600">{t('terms.intellectualProperty.p2')}</p>
            <p className="text-gray-600">{t('terms.intellectualProperty.p3')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('terms.payments.title')}</h2>
            <p className="text-gray-600">{t('terms.payments.p1')}</p>
            <p className="text-gray-600">{t('terms.payments.p2')}</p>
            <p className="text-gray-600">{t('terms.payments.p3')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('terms.disputes.title')}</h2>
            <p className="text-gray-600">{t('terms.disputes.p1')}</p>
            <p className="text-gray-600">{t('terms.disputes.p2')}</p>
            <p className="text-gray-600">{t('terms.disputes.p3')}</p>

            <h2 className="text-2xl font-semibold text-gray-900">{t('terms.forceMajeure.title')}</h2>
            <p className="text-gray-600">{t('terms.forceMajeure.description')}</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>{t('terms.forceMajeure.items.natural')}</li>
              <li>{t('terms.forceMajeure.items.government')}</li>
              <li>{t('terms.forceMajeure.items.military')}</li>
              <li>{t('terms.forceMajeure.items.technical')}</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900">{t('terms.privacy.title')}</h2>
            <p className="text-gray-600">{t('terms.privacy.p1')}</p>
            <p className="text-gray-600">{t('terms.privacy.p2')}</p>
            <p className="text-gray-600">{t('terms.privacy.p3')}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
