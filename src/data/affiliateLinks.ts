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
  },
  'primebiome': {
    id: 'primebiome',
    title: 'PrimeBiome',
    description: 'Support your gut health and digestive system',
    url: 'https://example.com/primebiome-affiliate-link',
    category: 'supplements'
  },
  'quietum-plus': {
    id: 'quietum-plus',
    title: 'Quietum Plus',
    description: 'Natural support for ear health and reducing ringing',
    url: 'https://example.com/quietum-plus-affiliate-link',
    category: 'supplements'
  },
  'prostav-ive': {
    id: 'prostav-ive',
    title: 'ProstaVive',
    description: 'Comprehensive prostate health support',
    url: 'https://example.com/prostav-ive-affiliate-link',
    category: 'supplements'
  },
  'hepato-burn': {
    id: 'hepato-burn',
    title: 'HepatoBurn',
    description: 'Support healthy metabolism and energy levels',
    url: 'https://example.com/hepato-burn-affiliate-link',
    category: 'supplements'
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