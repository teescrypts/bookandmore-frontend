import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import StaffList from "../components/staffs/staff-list/staff-list";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import { staffPaths } from "@/paths";

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
  message?: StaffInfoType[];
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/staff-infos", {
    token: session,
    tag: "fetchStaffInfo",
  });

  if (response?.error) throw new Error(response.error);

  const staffInfo = response.message!;

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
                    endIcon={<Chip label="4" size="small" color="primary" />}
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
