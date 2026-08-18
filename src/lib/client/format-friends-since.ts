const DAY_MS = 24 * 60 * 60 * 1000;

export const formatFriendsSince = (acceptedAt: string): string => {
  const days = Math.floor((Date.now() - new Date(acceptedAt).getTime()) / DAY_MS);

  if (days <= 0) return 'today';
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;

  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? '1 month' : `${months} months`;

  const years = Math.floor(days / 365);
  return years === 1 ? '1 year' : `${years} years`;
};
