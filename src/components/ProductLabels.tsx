import React from 'react';

export type ProductLabelPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface ProductLabel {
  id: string;
  type: 'text' | 'percentage';
  value: string;
  position: ProductLabelPosition;
  color: string | null;
}

interface ProductLabelsProps {
  labels: ProductLabel[];
  variant?: 'default' | 'featured';
}

/**
 * Renders product labels grouped by corner position.
 */
export const ProductLabels: React.FC<ProductLabelsProps> = ({
  labels,
  variant = 'default',
}) => {
  if (!labels || labels.length === 0) return null;

  const isFeatured = variant === 'featured';
  const positions: ProductLabelPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

  const getColorClasses = (label: ProductLabel) => {
    if (label.color) {
      return '';
    }

    if (label.type === 'percentage') {
      return isFeatured ? 'bg-[#e05d5d] text-cream' : 'bg-red-600 text-white';
    }

    const value = label.value.toLowerCase();
    if (value.includes('new') || value.includes('նոր')) {
      return isFeatured ? 'bg-green-600 text-cream' : 'bg-green-600 text-white';
    }
    if (value.includes('hot') || value.includes('տաք')) {
      return isFeatured ? 'bg-orange-600 text-cream' : 'bg-orange-600 text-white';
    }
    if (value.includes('sale') || value.includes('զեղչ')) {
      return isFeatured ? 'bg-[#e05d5d] text-cream' : 'bg-red-600 text-white';
    }

    return isFeatured ? 'bg-[#e05d5d] text-cream' : 'bg-blue-600 text-white';
  };

  const getCornerPositionClasses = (position: ProductLabelPosition) => {
    if (isFeatured) {
      switch (position) {
        case 'top-left':
          return 'top-[63px] left-[13px] items-start';
        case 'top-right':
          return 'top-[62px] right-[13px] items-end';
        case 'bottom-left':
          return 'bottom-[88px] left-[15px] items-start';
        case 'bottom-right':
          return 'bottom-[88px] right-[19px] items-end';
        default:
          return '';
      }
    }

    switch (position) {
      case 'top-left':
        return 'top-2 left-2 items-start';
      case 'top-right':
        return 'top-2 right-2 items-end';
      case 'bottom-left':
        return 'bottom-2 left-2 items-start';
      case 'bottom-right':
        return 'bottom-2 right-2 items-end';
      default:
        return '';
    }
  };

  const getLabelClasses = (label: ProductLabel) => {
    if (isFeatured) {
      return `inline-flex h-[33px] min-w-[70px] items-center justify-center rounded-[20px] px-3 text-[14px] font-medium tracking-[-0.5px] shadow-sm pointer-events-auto ${getColorClasses(label)}`;
    }

    return `px-2 py-0.5 text-[10px] font-semibold rounded-md shadow-sm pointer-events-auto ${getColorClasses(label)}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {positions.map((position) => {
        const labelsForPosition = labels.filter((label) => label.position === position);
        if (labelsForPosition.length === 0) return null;

        return (
          <div
            key={position}
            className={`absolute flex flex-col gap-1 ${getCornerPositionClasses(position)}`}
          >
            {labelsForPosition.map((label) => (
              <div
                key={label.id}
                className={getLabelClasses(label)}
                style={label.color ? { backgroundColor: label.color, color: 'white' } : undefined}
              >
                {label.type === 'percentage' ? `${label.value}%` : label.value}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
