import { formatDistance } from "npm:date-fns"

export const now = () => new Date();

export function dateFormatter(
  date = now(),
  formatter = formatDistance,
) {
  return formatter(date, now());
}
