import { parseISO, parse, sub, format } from "date-fns";

const removeHoursFromDateTime = (
  date: string,
  time: string,
  hoursToRemove: number
) => {
  // Combine date and time into a single Date object
  const combinedDateTime = parse(
    `${date} ${time}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );

  // Subtract the given number of hours
  const updatedDateTime = sub(combinedDateTime, { hours: hoursToRemove });

  // Format the result back to the desired format
  const formattedDate = format(updatedDateTime, "yyyy-MM-dd");
  const formattedTime = format(updatedDateTime, "HH:mm");

  return { date: formattedDate, time: formattedTime };
};

export default removeHoursFromDateTime;
