import { parse, format, addHours } from "date-fns";
import { format as formatWithTimeZone } from "date-fns-tz";

type FormatDateTimeOptions = {
  date: string; // Date in "YYYY-MM-DD" format
  time: string; // Time in "HH:mm" (24-hour) format
  timeZone: string; // IANA Timezone identifier
  duration: number; // Duration in hours to subtract
};

export default function formatDateTimeWithTimeZone({
  date,
  time,
  timeZone,
  duration,
}: FormatDateTimeOptions): string {
  console.log(date, time, timeZone, duration);
  // Parse the date and time into a Date object in the given timezone
  const dateTimeString = `${date} ${time}`;
  const parsedDate = parse(dateTimeString, "yyyy-MM-dd HH:mm", new Date());

  // Subtract the duration in hours
  const adjustedDate = addHours(parsedDate, -duration);

  // Format the date with the timezone abbreviation (no need for conversion)
  const formattedDate = formatWithTimeZone(
    adjustedDate,
    "h:mma 'on' MMMM d, yyyy z",
    { timeZone }
  );

  return formattedDate;
}
