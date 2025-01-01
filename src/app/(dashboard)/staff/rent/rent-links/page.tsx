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
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import { staffPaths } from "@/paths";
import PendingFormsList from "../../components/rent/pending-forms";

interface PendingForm {
  _id: string;
  category: string;
  tenantInfo: {
    fname: string;
    lname: string;
    email: string;
  };
  link: string;
}

interface Response {
  error?: string;
  message?: PendingForm[];
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/rent-forms", {
    token: session,
    tag: "fetchRentForms",
  });

  if (response?.error)
    throw new Error("Something went wrong. Please try again");

  const pendingForms = response.message!;

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
            <Typography variant="h4">Pending Rent Forms</Typography>
            <Breadcrumbs separator={<BreadcrumbsSeparator />}>
              <Link
                color="text.primary"
                component={RouterLink}
                href={staffPaths.dashboard.rent.index}
                variant="subtitle2"
              >
                Rent
              </Link>
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
