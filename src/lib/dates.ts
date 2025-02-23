import { DISPLAY_DATE_FORMAT } from '@/constants/appConfig';
import dayjs from 'dayjs'

export const displayDate = (date?: Date, format?: string) => {
    if (!date) return dayjs().format(format || DISPLAY_DATE_FORMAT);

    return dayjs(date).format(format || DISPLAY_DATE_FORMAT);
}