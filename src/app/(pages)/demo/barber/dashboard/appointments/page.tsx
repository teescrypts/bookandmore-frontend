import React from "react";
import AppointmentPage, {
  CustomerAppointmentType,
} from "../component/appointments/appointment-page";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";

interface Response {
  error?: string;
  message?: CustomerAppointmentType[];
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/bookings", {
    token: session,
    tag: "fetchCustomerAppointment",
  });

  if (response?.error) throw new Error(response.error);
  const appointments = response.message!;

  return <AppointmentPage appointments={appointments} />;
}

export default Page;
