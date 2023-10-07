import { DateTime } from 'luxon';

function formatDate(date: string) {
  const newDate = DateTime.fromISO(date);
  return newDate.toFormat('dd - LL - yyyy');
}

export { formatDate };
