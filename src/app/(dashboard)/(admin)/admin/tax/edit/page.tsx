import { BreadcrumbsSeparator } from "@/components/breadcrumbs-separatr";
import { RouterLink } from "@/components/router-link";
import { adminPaths } from "@/paths";
import apiRequest from "@/utils/api-request";
import { getSession } from "@/utils/get-session";
import {
  Box,
  Container,
  Stack,
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";
import React from "react";
import TaxSettings from "../../components/tax/automatic/tax-settings";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Edit Tax Settings",
  description: "Set Tax settings",
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
  message?: { _id: string; name: string }[];
}

async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await getSession();
  const result = await apiRequest<Response>("/api/taxes/locations", {
    token: session,
  });

  if (result.error) {
    throw new Error("Something went wrong. Please refresh");
  }

  const branches = result.message!;
  const currentBehavior = searchParams?.behavior;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4">Edit Settings</Typography>
            <Breadcrumbs separator={<BreadcrumbsSeparator />}>
              <Link
                color="text.primary"
                component={RouterLink}
                href={adminPaths.dashboard.tax.index}
                variant="subtitle2"
              >
                Tax
              </Link>
              <Typography color="text.secondary" variant="subtitle2">
                Edit Settings
              </Typography>
            </Breadcrumbs>
          </Stack>
          <TaxSettings currentBehavior={currentBehavior} branches={branches} />
        </Stack>
      </Container>
    </Box>
  );
}

export default Page;
