export const dynamic = 'force-dynamic'

import React from "react";
import PointOfSale from "../components/pos/point-of-sale";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Metadata } from "next";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import NoActiveBranch from "@/components/no-active-branch";
import Link from "next/link";
import { adminPaths } from "@/paths";

export const metadata: Metadata = {
  title: "Point of sale",
  description: "Sell and record in person sales",
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

export interface ProductPos {
  _id: string; // _id will typically be mapped to id in the frontend
  admin: string; // References a User
  branch: string; // References a Branch
  name: string;
  category: {
    name: string;
    taxCode: string;
  };
  description?: string;
  price: number;
  expiryDate?: string; // Dates are usually sent as strings in JSON
  SKU?: string;
  barcode?: string;
  sizeBasedQuantity: {
    enabled: boolean;
    details: {
      sizeType?: string;
      quantity?: number;
    }[];
  };
  quantity?: number;
  images: {
    url: string;
    fileName?: string;
    imageId: string;
  }[];
  sellOnlyWithAppointment: boolean;
  inStock: boolean;
  stripeData: {
    priceId: string;
    productId: string;
  };
  createdAt: string; // From Mongoose timestamps
  updatedAt: string; // From Mongoose timestamps
}

export interface CustomerPos {
  _id: string;
  fname: string;
  lname: string;
  email: string;
}

interface Response {
  error?: string;
  message?: { products: ProductPos[]; customers: CustomerPos[] } | string;
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/pos/fetch/data", {
    token: session,
    tag: "fetchPosData",
  });

  if (response?.error) throw new Error(response.error);

  const result = response.message!;

  if (result === "No active branch found") {
    return <NoActiveBranch message={result} />;
  }

  let products;
  let customers;

  if (typeof result !== "string") {
    products = result.products;
    customers = result.customers;
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={"xl"}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          sx={{ mb: 2 }}
        >
          <Typography variant="h4" gutterBottom>
            POS
          </Typography>

          <Link href={`${adminPaths.dashboard.ecommerce.pos}/sales`}>
            <Button variant="contained">Sales</Button>
          </Link>
        </Stack>
        <PointOfSale products={products!} customers={customers!} />
      </Container>
    </Box>
  );
}

export default Page;
