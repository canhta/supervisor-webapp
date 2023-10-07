import { DateTime } from 'luxon';

export function formatDate(date: string) {
  return DateTime.fromISO(date)
    .plus({ hours: 7 }) // TODO: For now Database is deploying on Singapore with timezone +7
    .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
}
