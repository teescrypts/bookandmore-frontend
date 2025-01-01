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
import AddStaffForm from "../../components/staffs/add-staff-form";
import { adminPaths } from "@/paths";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";

export interface ServiceForFormType {
  _id: string;
  name: string;
}

interface Response {
  error?: string;
  message: ServiceForFormType[];
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>(
    "/api/fetch/services/staff-forms",
    {
      token: session,
      tag: "fetchServicesForRentForm",
    }
  );

  if (response?.error) throw new Error(response.error);

  const services = response.message;

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
            <Typography variant="h4">Add Form</Typography>
            <Breadcrumbs separator={<BreadcrumbsSeparator />}>
              <Link
                color="text.primary"
                component={RouterLink}
                href={adminPaths.dashboard.staff.index}
                variant="subtitle2"
              >
                Staffs
              </Link>
              <Typography color="text.secondary" variant="subtitle2">
                Add
              </Typography>
            </Breadcrumbs>
          </Stack>
          <AddStaffForm services={services} />
        </Stack>
      </Container>
    </Box>
  );
}

export default Page;
