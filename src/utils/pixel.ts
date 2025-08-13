export const trackLead = (params?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', params);
    }
  } catch (err) {
    // no-op
  }
};

export const trackCompleteRegistration = (params?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'CompleteRegistration', params);
    }
  } catch (err) {
    // no-op
  }
};
