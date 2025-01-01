import { Box, Container, Stack, Typography } from "@mui/material";
import React from "react";
import CustomerListTable from "../components/customers/customer-list/customer-list-table";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";

export interface CustomerInfo {
  id: string;
  customerName: string; // Resolved from "User" reference
  email: string; // Add email for searching
  loyaltyPoint: {
    total: number;
    redeemed: number;
  };
  referralCode: {
    value?: string;
    count?: number;
  };
  referred?: {
    code?: string;
    used?: boolean;
  };
  cancelledAppointments: number;
  completedAppointments: number;
  totalAppointments: number;
  purcheses: number;
  createdAt: string;
}

interface Response {
  error?: string;
  message?: CustomerInfo[];
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/customer-info", {
    token: session,
    tag: "fetchCustomerInfoAdmin",
  });

  if (response?.error) throw new Error(response.error);

  const customerInfo = response.message!;

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Typography variant="h3">Customers</Typography>
            <CustomerListTable customerInfo={customerInfo} />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Page;
