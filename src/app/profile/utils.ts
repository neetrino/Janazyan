export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-butter/60 text-ink-800';
    case 'confirmed':
      return 'bg-sky/25 text-sky-deep';
    case 'processing':
      return 'bg-lavender/40 text-ink-800';
    case 'shipped':
      return 'bg-sky-mist/60 text-ink-800';
    case 'delivered':
    case 'completed':
      return 'bg-sage/60 text-ink-800';
    case 'cancelled':
      return 'bg-sale/15 text-sale';
    default:
      return 'bg-sky-mist/40 text-ink-700';
  }
};

export const getPaymentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'bg-sage/60 text-ink-800';
    case 'pending':
      return 'bg-butter/60 text-ink-800';
    case 'failed':
      return 'bg-sale/15 text-sale';
    case 'refunded':
      return 'bg-lavender/40 text-ink-800';
    default:
      return 'bg-sky-mist/40 text-ink-700';
  }
};

export const getColorValue = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'beige': '#F5F5DC',
    'black': '#000000',
    'blue': '#0000FF',
    'brown': '#A52A2A',
    'gray': '#808080',
    'grey': '#808080',
    'green': '#008000',
    'red': '#FF0000',
    'white': '#FFFFFF',
    'yellow': '#FFFF00',
    'orange': '#FFA500',
    'pink': '#FFC0CB',
    'purple': '#800080',
    'navy': '#000080',
    'maroon': '#800000',
    'olive': '#808000',
    'teal': '#008080',
    'cyan': '#00FFFF',
    'magenta': '#FF00FF',
    'lime': '#00FF00',
    'silver': '#C0C0C0',
    'gold': '#FFD700',
  };
  
  const normalizedName = colorName.toLowerCase().trim();
  return colorMap[normalizedName] || '#CCCCCC';
};



