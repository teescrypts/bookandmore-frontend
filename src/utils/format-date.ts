import { format } from "date-fns";

export default function formatDate(secondsSinceEpoch: number): string {
  console.log(secondsSinceEpoch);
  const date = new Date(secondsSinceEpoch * 1000);
  console.log(date);
  return format(date, "MMMM d, yyyy");
}
