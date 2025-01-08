export const dynamic = 'force-dynamic'

import { Box, Container, Stack, Typography } from "@mui/material";
import React from "react";
import GeneralSettings from "./general-settings";
import SecuritySettings from "./security-settings";
import ReusableTabs from "@/components/tab";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";

interface UserType {
  _id: string;
  fname: string;
  lname: string;
  email: string;
}

interface RequestType {
  message: UserType;
}

async function AccountManager() {
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

export default AccountManager;
