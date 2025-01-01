import apiRequest from "@/utils/api-request";
import React from "react";
import StaffForm from "../../components/staff-form";
import EmptyState from "@/components/empty-state";
import { Box, Button, Container, Stack } from "@mui/material";
import Link from "next/link";

export interface StaffForm {
  _id: string;
  admin: string;
  branch: string;
  fname: string;
  lname: string;
  email: string;
  dob: {
    day: string;
    month: string;
    year: string;
  };
  category: "regular" | "commission";
  regularSettings?: {
    allowBooking: boolean;
  };
  commissionSettings?: {
    commission?: number;
  };
  permissions: {
    [key: string]: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
  services: { _id: string; name: string }[];
}

interface Response {
  error?: string;
  message?: StaffForm;
}

async function Page({ params }: { params: { id: string } }) {
  const response = await apiRequest<Response>(`/api/staff-forms/${params.id}`, {
    tag: "fetchStaffForm",
  });

  if (response?.error) {
    return (
      <Box
        sx={{
          flex: "1 1 auto",
          minHeight: "100%",
          my: { xs: 4, md: 0 },
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: {
              xs: "60px",
              md: "120px",
            },
            textAlign: "center",
          }}
        >
          <Stack>
            <EmptyState message="No form was found. If you've already started the onboarding process, please log in to your dashboard to complete it." />
            <Stack>
              <Link href={"/demo/login"}>
                <Button variant="contained">Login</Button>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    );
  }

  const staffForm = response.message!;

  return <StaffForm staffForm={staffForm} />;
}

export default Page;
