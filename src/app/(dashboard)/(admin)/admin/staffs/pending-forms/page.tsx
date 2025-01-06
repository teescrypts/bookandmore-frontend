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
import PendingFormsList from "../../components/staffs/pending-forms";
import { adminPaths } from "@/paths";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Pending Staff forms",
  description: "Pending staff onbaording form",
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

export interface PendingForm {
  _id: string;
  category: string;
  fname: string;
  lname: string;
  email: string;
  permissions: Permissions;
  services: { _id: string; name: string }[];
}

interface Response {
  error?: string;
  message?: PendingForm[];
}

async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/staff-forms", {
    token: session,
    tag: "fetchStaffPendingForm",
  });

  if (response?.error) throw new Error(response.error);

  const pendingForms = response.message!;

  const from = searchParams?.from;

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
            <Typography variant="h4">Pending Forms</Typography>
            <Breadcrumbs separator={<BreadcrumbsSeparator />}>
              <Link
                color="text.primary"
                component={RouterLink}
                href={adminPaths.dashboard.staff.index}
                variant="subtitle2"
              >
                Staffs
              </Link>
              {from && (
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={adminPaths.dashboard.staff.add}
                  variant="subtitle2"
                >
                  Add forms
                </Link>
              )}
              <Typography color="text.secondary" variant="subtitle2">
                Pending forms
              </Typography>
            </Breadcrumbs>
          </Stack>
          <PendingFormsList pendingForms={pendingForms} />
        </Stack>
      </Container>
    </Box>
  );
}

export default Page;
