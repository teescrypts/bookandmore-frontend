export const dynamic = "force-dynamic";

import React from "react";
import AccountPage from "../components/account";
import { Box, Container, Stack, Typography } from "@mui/material";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Shop tenant dasboard",
  description: "Manage subscription from one dashboaard",
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

export interface User {
  _id: string;
  fname: string;
  lname: string;
  email: string;
}

interface Response {
  error?: string;
  message?: User;
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/users", {
    token: session,
    tag: "fetchTenant",
  });

  if (response?.error) throw new Error(response.error);

  const user = response.message!;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <Stack spacing={1}>
              <Typography variant="h4"> Account Settings</Typography>
            </Stack>
          </Stack>
          <AccountPage user={user} />
        </Stack>
      </Container>
    </Box>
  );
}

export default Page;
