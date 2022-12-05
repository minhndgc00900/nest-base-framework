import * as dayjs from 'dayjs';
import * as _utc from 'dayjs/plugin/utc';
import * as _timezone from 'dayjs/plugin/timezone';
dayjs.extend(_utc);
dayjs.extend(_timezone);

export class UtilService {
  static utcToTimezone(timestamp: number, timezone: string): Date {
    return dayjs.unix(timestamp).tz(timezone).toDate();
  }
}
