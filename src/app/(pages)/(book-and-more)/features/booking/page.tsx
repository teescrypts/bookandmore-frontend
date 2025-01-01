import { Stack } from "@mui/material";
import React from "react";
import Banner from "../../components/banner";
import FeaturePage from "../../components/feature-page";

function Page() {
  return (
    <Stack spacing={6}>
      <Banner
        title="Effortless Appointment Booking & Management"
        subtitle="Streamline Booking for You and Your Clients."
      />
      <FeaturePage
        title="Booking"
        description="Effortlessly manage your opening hours, services, and booking policies from a user-friendly dashboard. Customize key settings like lead time and booking windows, and set policies for rescheduling and cancellations. The dashboard also includes an intuitive calendar, giving you full control over time slots, appointments, and availability—making it easy to stay organized and efficient."
        image="/assets/imgs/booking.png"
      />
    </Stack>
  );
}

export default Page;
