export default function convertToIso(
  day: string | number,
  month: string | number,
  year: string | number
): string {
  const parsedDay = parseInt(day.toString(), 10);
  const parsedMonth = parseInt(month.toString(), 10);
  const parsedYear = parseInt(year.toString(), 10);

  const formattedDay = String(parsedDay).padStart(2, "0");
  const formattedMonth = String(parsedMonth).padStart(2, "0");

  return `${parsedYear}-${formattedMonth}-${formattedDay}`;
}
