export const dynamic = 'force-dynamic'

import { BreadcrumbsSeparator } from "@/components/breadcrumbs-separatr";
import { RouterLink } from "@/components/router-link";
import {
  Box,
  Container,
  Stack,
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";
import React from "react";
import RentForm from "../../components/rent/rent-form";
import { adminPaths } from "@/paths";
import apiRequest from "@/utils/api-request";
import { getSession } from "@/utils/get-session";
import { Subscription } from "../page";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Shop Rent forms",
  description: "Maanage Shop rent forms",
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

async function Page() {
  const session = await getSession();
  const response = await apiRequest<{
    message?: Subscription[];
    error?: string;
  }>("/api/subscriptions", {
    token: session,
    tag: "fetchSubscriptions",
  });

  if (response?.error) throw new Error(response.error);

  const subscriptions = response.message!;

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h4">Create Rent Form</Typography>
                <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                  <Link
                    color="text.primary"
                    component={RouterLink}
                    href={adminPaths.dashboard.rent.index}
                    variant="subtitle2"
                  >
                    Rent
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Rent form
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Stack>
            <RentForm subscriptions={subscriptions} />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Page;
