import { BreadcrumbsSeparator } from "@/components/breadcrumbs-separatr";
import { RouterLink } from "@/components/router-link";
import { adminPaths } from "@/paths";
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
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Tax Settings",
  description: "Set Tax settings",
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
                    href={adminPaths.dashboard.tax.index}
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
