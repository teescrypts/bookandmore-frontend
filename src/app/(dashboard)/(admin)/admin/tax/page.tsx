import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Metadata } from "next";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import TaxSettingsPage from "../components/tax/tax-settings-page";

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
        url: "https://bookandmore.live/assets/", // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

interface Registrations {
  id: string;
  active_from: number;
  country: string;
  type: string;
  state: string;
}

interface HeadOffice {
  country: string;
  line1: string;
  postal_code: string;
  state: string;
  city: string;
}

interface TaxSettingsType {
  registrations: Registrations[];
  settings: {
    tax_behavior: "exclusive" | "inclusive" | "inferred_by_currency";
    head_office: HeadOffice;
    status: "active" | "pending";
  };
}

export interface Data {
  taxSettings: TaxSettingsType;
  autoTax: boolean;
}

interface FetchResponse {
  error?: string;
  message?: Data | string;
}

async function Page() {
  const session = await getSession();
  const data = await apiRequest<FetchResponse>("/api/taxes", {
    token: session,
  });

  if (data.error) {
    throw new Error("Unable to fetch settings. Please refresh");
  }

  const taxSettings = data.message!;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={2}>
          <Typography variant="h4">Tax</Typography>
          <TaxSettingsPage settings={taxSettings} />
        </Stack>
      </Container>
    </Box>
  );
}

export default Page;
