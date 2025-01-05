import apiRequest from "@/utils/api-request";
import { getSession } from "@/utils/get-session";
import { Metadata } from "next/types";
import React from "react";
import ReusableTabs from "@/components/tab";
import { Box, Container, Stack, Typography } from "@mui/material";
import Finance from "../../(admin)/admin/components/account/finance";
import GeneralSettings from "../components/account/general-settings";
import SecuritySettings from "../components/account/security-settings";

export const metadata: Metadata = {
  title: "Account",
  description: "Account settings",
  openGraph: {
    title: "Book and more",
    description: "The All in one website for Barber brands and shops",
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

interface UserType {
  _id: string;
  fname: string;
  lname: string;
  email: string;
}

interface RequestType {
  message: UserType;
}

async function Page() {
  const token = await getSession();
  const response = await apiRequest<RequestType>("/api/users", {
    token,
    tag: "fetchUser",
  });

  const user = response.message;

  const tabLabels = ["General", "Security"];
  const tabContent = [
    <GeneralSettings key={0} user={user} />,
    <SecuritySettings key={1} />,
  ];

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
          <Stack spacing={3} sx={{ mb: 3 }}>
            <Typography variant="h4">Account</Typography>
            <div>
              <ReusableTabs tabLabels={tabLabels} tabContents={tabContent} />
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Page;
