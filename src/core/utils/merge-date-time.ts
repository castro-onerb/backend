import dayjs from '@/core/config/dayjs.config';
import { Dayjs } from 'dayjs';
import { normalizeDateInput } from './normalize-date-input';

export const mergeDateAndTime = (
  date: string | Date | Dayjs,
  time: string | Date | Dayjs,
): Date => {
  const localDate = normalizeDateInput(date);
  const base = dayjs(localDate).local().tz();
  const timeObj = dayjs(time).local().tz();

  const merged = base
    .hour(timeObj.hour())
    .minute(timeObj.minute())
    .second(timeObj.second())
    .millisecond(0);

  return merged.toDate();
};
