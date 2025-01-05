import React from "react";
import CalendarUi from "../components/calendar/calendar-ui";
import { Box, Container } from "@mui/material";
import { Metadata } from "next";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";

export const metadata: Metadata = {
  title: "Calendar",
  description: "Manage bookings",
  openGraph: {
    title: "Book and more",
    description: "The All in one website for small business owners",
    url: "https://bookandmore.live",
    siteName: "Book and More",
    images: [
      {
        url: "https://bookandmore.live/assets/imgs/impact-logo.png", // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

interface Response {
  error?: string;
  message?: string;
}

async function page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/calendar/get/time-zone", {
    token: session,
    tag: "fetchCalendarTimeZone",
  });

  if (response?.error) throw new Error(response.error);

  const timeZone = response.message!;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <CalendarUi timeZone={timeZone} />
      </Container>
    </Box>
  );
}

export default page;
