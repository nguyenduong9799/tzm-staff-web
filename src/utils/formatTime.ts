import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date: string | number | Date, formatStr: string = 'dd/MM/yyy') {
  return format(new Date(date), formatStr);
}
export function fDateTime(date: Date | string | number, formatStr: string = 'dd/MM/yyyy HH:mm') {
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    return '-';
  }
}

export function fTimestamp(date: Date | string | number) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date: Date | string | number) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date: Date | string | number) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}
