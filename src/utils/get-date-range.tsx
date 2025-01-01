import { DateTime } from "luxon";

type ViewType = "dayGridMonth" | "timeGridDay";

function getDateRange(date: string | Date) {
  const selectedDate =
    typeof date === "string"
      ? DateTime.fromISO(date)
      : DateTime.fromJSDate(date);

  let startDate: string, endDate: string;

  startDate = selectedDate.startOf("month").toFormat("yyyy-MM-dd");
  endDate = selectedDate.endOf("month").toFormat("yyyy-MM-dd");

  return { startDate, endDate };
}

export default getDateRange;
