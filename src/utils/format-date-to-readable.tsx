import { parse, format } from "date-fns";

// Function to format the date
const formatDateToReadable = (date: string) => {
  // Parse the input date string
  const parsedDate = parse(date, "yyyy-MM-dd", new Date());

  // Format it in an American-readable format
  return format(parsedDate, "MMMM d, yyyy");
};

export default formatDateToReadable;
