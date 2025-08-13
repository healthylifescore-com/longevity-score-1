export interface AffiliateLink {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
}

export const affiliateLinks: Record<string, AffiliateLink> = {
  'keto-breads': {
    id: 'keto-breads',
    title: 'Keto Breads Cookbook',
    description: 'Delicious keto-friendly bread recipes',
    url: 'https://example.com/keto-breads-affiliate-link',
    category: 'nutrition'
  },
  'soup-diet': {
    id: 'soup-diet',
    title: 'Healing Soup Diet',
    description: 'Nutrient-rich soups for optimal health',
    url: 'https://example.com/soup-diet-affiliate-link',
    category: 'nutrition'
  },
  'supplement-guide': {
    id: 'supplement-guide',
    title: 'Essential Supplements Guide',
    description: 'Science-backed supplement recommendations',
    url: 'https://example.com/supplement-guide-affiliate-link',
    category: 'supplements'
  },
  'fitness-program': {
    id: 'fitness-program',
    title: 'Longevity Fitness Program',
    description: 'Age-defying exercise routines',
    url: 'https://example.com/fitness-program-affiliate-link',
    category: 'exercise'
  },
  'sleep-optimizer': {
    id: 'sleep-optimizer',
    title: 'Sleep Optimization Course',
    description: 'Master the art of restorative sleep',
    url: 'https://example.com/sleep-optimizer-affiliate-link',
    category: 'sleep'
  },
  'stress-management': {
    id: 'stress-management',
    title: 'Stress Management Toolkit',
    description: 'Proven techniques for stress reduction',
    url: 'https://example.com/stress-management-affiliate-link',
    category: 'mental-health'
  }
};

export const getAffiliateLink = (linkId: string): AffiliateLink | null => {
  return affiliateLinks[linkId] || null;
};

export const generateRedirectUrl = (linkId: string, email?: string): string => {
  const baseUrl = 'https://healthylifescore.com';
  const params = email ? `?email=${encodeURIComponent(email)}` : '';
  return `${baseUrl}/redirect/${linkId}${params}`;
};