export const dynamic = 'force-dynamic'

import React from "react";
import LoyaltyPointSettings from "../../components/marketing/loyalty-points/loyalty-point-settings";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Metadata } from "next/types";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import { ProductsAndServiceType } from "./add/page";
import { revalidateTag } from "next/cache";

export const metadata: Metadata = {
  title: "Loyalty Points (Settings)",
  description: "Maanage Loyalty Point Settings",
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

export interface LoyaltyPointsSettingTypes {
  _id: string;
  active: boolean;
  monetaryEquivalent: number;
  enableReferral: boolean;
  minimumReferral?: number;

  enableAppointment: boolean;
  minimumAmountEnabledApt: boolean;
  minimumAmountApt?: number;
  appliesToApt: boolean;
  aptServiceIds?: string[];

  enableProduct: boolean;
  minimumAmountEnabledProd: boolean;
  minimumAmountProd?: number;
  appliesToProd: boolean;
  prodServiceIds?: string[];
}

interface Response {
  error?: string;
  message: {
    loyaltyPointSettings: LoyaltyPointsSettingTypes;
    products: ProductsAndServiceType[];
    services: ProductsAndServiceType[];
    removedServices?: ProductsAndServiceType[];
    removedProducts?: ProductsAndServiceType[];
  };
}

async function Page() {
  revalidateTag("fetchLoyaltypointsSettings");
  const session = await getSession();
  const response = await apiRequest<Response>("/api/loyalty-point-settings", {
    token: session,
    tag: "fetchLoyaltypointsSettings",
  });

  if (response?.error) throw new Error(response.error);

  const loyaltyPointSettings = response.message!.loyaltyPointSettings;
  const products = response.message!.products;
  const services = response.message!.services;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h3">Loyalty Points</Typography>
          <LoyaltyPointSettings
            settings={loyaltyPointSettings}
            products={products}
            services={services}
            existingProducts={response.message.removedProducts}
            existingServices={response.message.removedServices}
          />
        </Stack>
      </Container>
    </Box>
  );
}

export default Page;
