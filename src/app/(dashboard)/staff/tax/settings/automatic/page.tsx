import { BreadcrumbsSeparator } from "@/components/breadcrumbs-separatr";
import { RouterLink } from "@/components/router-link";
import { staffPaths } from "@/paths";
import {
  Box,
  Container,
  Stack,
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";
import React from "react";
import AutomaticTaxSetup from "../../../components/tax/automatic/automatic-tax-setup";

function Page() {
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
                <Typography variant="h4">Automatic Tax Settings</Typography>
                <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                  <Link
                    color="text.primary"
                    component={RouterLink}
                    href={staffPaths.dashboard.tax.index}
                    variant="subtitle2"
                  >
                    Tax
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Automatic
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Stack>
            <AutomaticTaxSetup />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Page;
