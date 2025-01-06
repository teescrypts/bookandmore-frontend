export const dynamic = 'force-dynamic'

import React from "react";
import ShippingSettings from "../components/shipping/shipping";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Metadata } from "next";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";

export const metadata: Metadata = {
  title: "Manage Shipping",
  description: "Manage shipping settings for cheeckout",
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


export interface ShippingOptionType {
  _id: string;
  displayName: string;
  amount: number;
  minEstimate: number;
  maxEstimate: number;
  unit: string;
}

export interface AllowedCountryType {
  _id: string;
  country: { name: string; isoCode: string };
}

interface Response {
  error?: string;
  message?: {
    shippingOptions: ShippingOptionType[];
    allowedCountries: AllowedCountryType[];
  };
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/shipping-options", {
    token: session,
    tag: "fetchShippingOptions",
  });

  if (response?.error) throw new Error(response.error);

  const shippingOptions = response.message!
    .shippingOptions as ShippingOptionType[];
  const allowedCountries = response.message!.allowedCountries;

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
          <Typography variant="h4">Shipping</Typography>
          <ShippingSettings
            shippingRates={shippingOptions}
            allowedCountries={allowedCountries}
          />
        </Stack>
      </Container>
    </Box>
  );
}

export default Page;
