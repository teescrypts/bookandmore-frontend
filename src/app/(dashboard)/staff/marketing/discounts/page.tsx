import React from "react";
import DiscountSettings from "../../components/marketing/discounts/discount-settings";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Metadata } from "next/types";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";

export const metadata: Metadata = {
  title: "Discount",
  description: "Maanage Discount Promotion",
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


export interface AddedProductType {
  _id: string;
  name: string;
}

export interface AddedServiceType {
  _id: string;
  name: string;
}

export interface PromotionCodeType {
  _id: string;
  code: string;
  maxRedemptions: number;
  restrictions: {
    firstTransactionOnly: boolean;
    minimumAmount: number;
  };
  active: boolean;
  createdAt: string;
}

export interface CouponType {
  _id: string;
  valueType: "percent_off" | "amount_off";
  value: number;
  maxRedemptions: number;
  expiresAt: Date;
  addedProducts: AddedProductType[];
  addedServices: AddedServiceType[];
  promotionCodes: PromotionCodeType[];
  stripeData: {
    couponId: string;
  };
}

export interface ProductType {
  _id: string;
  price: number;
  name: string;
  stripeData: {
    priceId: string;
    productId: string;
  };
}

export interface ServiceType {
  _id: string;
  priceAmount: number;
  name: string;
  stripeData: {
    priceId: string;
    productId: string;
  };
}

interface Response {
  error?: string;
  message?: {
    coupons: CouponType[];
    products: ProductType[];
    services: ServiceType[];
  };
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/coupons", {
    token: session,
    tag: "fetchCoupons",
  });

  if (response?.error) throw new Error(response.error);

  const { coupons, products, services } = response.message!;

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
          <Typography variant="h3">Discounts</Typography>
          <DiscountSettings
            coupons={coupons}
            products={products}
            services={services}
          />
        </Stack>
      </Container>
    </Box>
  );
}

export default Page;
