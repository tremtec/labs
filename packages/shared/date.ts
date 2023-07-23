const relativeTimeFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "short",
  timeStyle: "short",
});

export const now = () => new Date();

export function dateFormatter(
  date = now(),
  formatter = relativeTimeFormatter,
) {
  return formatter.format(date);
}
