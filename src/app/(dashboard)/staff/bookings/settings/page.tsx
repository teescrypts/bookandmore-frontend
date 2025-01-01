import React from "react";
import AppointmentBookingSettings from "../components/booking-settings/settings";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Metadata } from "next";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";

export const metadata: Metadata = {
  title: "Booking Settings",
  description: "Set up reschedule and cancellation policies",
  openGraph: {
    title: "Book and more",
    description: "The All in one website for small business owners",
    url: "https://bookandmore.live",
    siteName: "Book and More",
    images: [
      {
        url: "https://bookandmore.live/assets/", // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export interface SettingsType {
  _id: string;
  policy: {
    collectCancelFee: boolean;
    feeTypeForCancel: "fixed" | "percent" | null;
    cancelFeeValue: number;
    cancellationNotice: number;
    collectNoshowFee: boolean;
    feeTypeForNoshow: "fixed" | "percent" | null;
    noshowFeeValue: number;
  };
  leadTime: number;
  bookingWindow: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Response {
  error?: string;
  message?: SettingsType | null;
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/booking-settings", {
    token: session,
    tag: "fetchBookingSettings",
  });

  if (response?.error) throw new Error(response.error);

  const setttings = response.message!;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={"lg"}>
        <Stack sx={{ mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Booking Settings
          </Typography>
        </Stack>
        <AppointmentBookingSettings settings={setttings} />
      </Container>
    </Box>
  );
}

export default Page;
