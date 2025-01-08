export const dynamic = "force-dynamic";

import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import StaffList from "../components/staffs/staff-list/staff-list";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import { staffPaths } from "@/paths";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Manage staffs",
  description: "Maanage Staffs",
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

export interface StaffInfoType {
  _id: string;
  staff: {
    _id: string;
    fname: string;
    lname: string;
    email: string;
    active: boolean;
  };
  type: "commission" | "regular";
  commission?: number;
}

interface Response {
  error?: string;
  message?: { staffInfo: StaffInfoType[]; pendingForms: number };
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/staff-infos", {
    token: session,
    tag: "fetchStaffInfo",
  });

  if (response?.error) throw new Error(response.error);

  const staffInfo = response.message!.staffInfo;
  const pendingForms = response.message!.pendingForms;

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
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography variant="h3">Staffs</Typography>

              <Stack direction={"row"} spacing={2}>
                <Link href={staffPaths.dashboard.staff.add}>
                  <Button size="small" variant="contained">
                    Add Forms
                  </Button>
                </Link>
                <Link href={`${staffPaths.dashboard.staff.pendingForms}`}>
                  <Button
                    size="small"
                    variant="outlined"
                    endIcon={
                      <Chip label={pendingForms} size="small" color="primary" />
                    }
                  >
                    Pending Forms
                  </Button>
                </Link>
              </Stack>
            </Stack>
            <StaffList staffs={staffInfo} />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Page;
