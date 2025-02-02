export const trimEmail = (email: string) => {
  if (!email) return '';

  const split = email?.split('@')?.[0];
  const trimmed = split?.slice(0, 16);
  const isLong = split?.length > trimmed?.length;

  if (isLong) {
    return trimmed.concat('...') || '';
  } else {
    return trimmed || '';
  }
};
