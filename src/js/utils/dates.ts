import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export const formatDateTime = (date: string) => {
  const dayjsDate = dayjs(date);
  const now = dayjs();
  const diffInDays = now.diff(dayjsDate, 'day');

  if (diffInDays >= 7) {
    const format = dayjsDate.year() === now.year() ? 'Do MMM, h:mm A' : 'Do MMM YYYY, h:mm A';
    return dayjsDate.format(format);
  } else {
    return dayjsDate.fromNow();
  }
};

export const formatDate = (date: string) => {
  const dayjsDate = dayjs(date);
  const now = dayjs();
  const diffInDays = now.diff(dayjsDate, 'day');

  if (diffInDays >= 7) {
    const format = dayjsDate.year() === now.year() ? 'Do MMM' : 'Do MMM YYYY';
    return dayjsDate.format(format);
  } else {
    return dayjsDate.fromNow();
  }
};

export const formatDateHourly = (date: string) => {
  const dayjsDate = dayjs(date);
  const now = dayjs();
  const diffInMinutes = now.diff(dayjsDate, 'minute');

  if (diffInMinutes < 60) {
    return `${diffInMinutes} mins ago`;
  } else {
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return minutes > 0 ? `${hours}hr ${minutes}mins ago` : `${hours}hr ago`;
  }
};

export const absoluteFormatDate = (date: string) => {
  return dayjs(date).format('Do MMMM YYYY');
};

export const formatTime = (date: string) => {
  return dayjs(date).format('h:mm A');
};

export const absoluteFormatDateTime = (value: string) => {
  const dayjsDate = dayjs(value);
  return dayjsDate.format('Do MMMM YYYY hh:mm A');
};
