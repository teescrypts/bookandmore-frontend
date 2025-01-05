import { Stack, Typography, Box, Container } from "@mui/material";
import React from "react";
import LoyaltyPointSetup from "../../../components/marketing/loyalty-points/loyalty-point-setup";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Loyalty Points (Set up)",
  description: "Maanage Loyalty Point Setup",
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

export interface ProductsAndServiceType {
  _id: string;
  name: string;
}

interface Response {
  error?: string;
  message: {
    products: ProductsAndServiceType[];
    services: ProductsAndServiceType[];
  };
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>(
    "/api/loyalty-point-settings/fetch/services/products",
    { token: session, tag: "fetchProdsAndServicesForLP" }
  );

  if (response?.error) throw new Error(response.error);

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
          <Typography variant="h3">Loyalty Points Setup</Typography>
          <LoyaltyPointSetup products={products} services={services} />
        </Stack>
      </Container>
    </Box>
  );
}

export default Page;
