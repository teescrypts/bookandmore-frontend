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
import RentForm from "../../components/rent/rent-form";
import apiRequest from "@/utils/api-request";
import { getSession } from "@/utils/get-session";
import { Subscription } from "../page";
import { staffPaths } from "@/paths";

async function Page() {
  const session = await getSession();
  const response = await apiRequest<{
    message?: Subscription[];
    error?: string;
  }>("/api/subscriptions", {
    token: session,
    tag: "fetchSubscriptions",
  });

  if (response?.error) throw new Error(response.error);

  const subscriptions = response.message!;

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
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h4">Create Rent Form</Typography>
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
                    Rent form
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Stack>
            <RentForm subscriptions={subscriptions} />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Page;
