'use client';

import { useState } from 'react';
import { FaqCategoriesSection } from './FaqCategoriesSection';
import { FaqItemsSection } from './FaqItemsSection';

/** Admin FAQ management — categories and Q&A items. */
export function FaqAdminPanel() {
  const [categoriesVersion, setCategoriesVersion] = useState(0);

  return (
    <div className="space-y-10">
      <FaqCategoriesSection
        onCategoriesChanged={() => setCategoriesVersion((v) => v + 1)}
      />
      <hr className="border-gray-200" />
      <FaqItemsSection categoriesVersion={categoriesVersion} />
    </div>
  );
}
