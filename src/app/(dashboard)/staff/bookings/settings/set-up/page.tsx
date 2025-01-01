import React from "react";
import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { Metadata } from "next";
import SetUp from "../../components/booking-settings/set-up";
import { BreadcrumbsSeparator } from "@/components/breadcrumbs-separatr";
import { RouterLink } from "@/components/router-link";
import { staffPaths } from "@/paths";

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

function Page() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={"lg"}>
        <Stack spacing={1}>
          <Typography variant="h4">Setup Booking Settings</Typography>
          <Breadcrumbs separator={<BreadcrumbsSeparator />}>
            <Link
              color="text.primary"
              component={RouterLink}
              href={staffPaths.dashboard.booking.settings.index}
              variant="subtitle2"
            >
              Settings
            </Link>
            <Typography color="text.secondary" variant="subtitle2">
              Setup
            </Typography>
          </Breadcrumbs>
        </Stack>
        <SetUp />
      </Container>
    </Box>
  );
}

export default Page;
