import React from "react";
import AddServiceForm from "../../components/services/add-service";
import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { RouterLink } from "@/components/router-link";
import { BreadcrumbsSeparator } from "@/components/breadcrumbs-separatr";
import { Metadata } from "next";
import { adminPaths } from "@/paths";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";

export const metadata: Metadata = {
  title: "Add Services",
  description: "Set up your services and start taking appointment",
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

export interface StaffTypeForService {
  _id: string;
  fname: string;
  lname: string;
}

interface Response {
  error?: string;
  message?: StaffTypeForService[];
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/services/fetch/staffs", {
    token: session,
    tag: "fetchStaffForService",
  });

  if (response?.error) throw new Error(response.error);

  const staffs = response.message!;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4">Add New Service</Typography>
            <Breadcrumbs separator={<BreadcrumbsSeparator />}>
              <Link
                color="text.primary"
                component={RouterLink}
                href={adminPaths.dashboard.booking.services}
                variant="subtitle2"
              >
                Services
              </Link>
              <Typography color="text.secondary" variant="subtitle2">
                Add
              </Typography>
            </Breadcrumbs>
          </Stack>
          <AddServiceForm staffs={staffs} />
        </Stack>
      </Container>
    </Box>
  );
}

export default Page;
