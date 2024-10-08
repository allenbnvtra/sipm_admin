export const formatBillingPeriod = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'PHP',
  });
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};
