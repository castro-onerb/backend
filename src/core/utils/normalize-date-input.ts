import { Dayjs } from 'dayjs';
import dayjs from '@/core/config/dayjs.config';

/**
 * Normaliza a entrada para Dayjs desconsiderando UTC (Z) se houver.
 */
export const normalizeDateInput = (input: string | Date | Dayjs): Dayjs => {
  if (typeof input === 'string') {
    return dayjs(input.replace(/Z$/, ''));
  }

  if (input instanceof Date) {
    const iso = input.toISOString().replace(/Z$/, '');
    return dayjs(iso);
  }

  return dayjs(input);
};
