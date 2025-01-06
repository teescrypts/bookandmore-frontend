export const dynamic = 'force-dynamic'

import React from "react";
import { revalidateTag } from "next/cache";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import OrderList from "../component/orders/order-list";
import { Box, Container } from "@mui/material";

interface Product {
  product: {
    name: string;
  };
  quantity: number;
  size?: string;
  price: number;
}

export interface CustomerOrderType {
  _id: string;
  products: Product[];
  totalAmount: number;
  totalDiscount: number;
  totalShipping: number;
  totalTax: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

interface Response {
  error?: string;
  message?: CustomerOrderType[];
}

async function Page() {
  revalidateTag("fetchCartItemCount");
  revalidateTag("fetchCartItems");
  revalidateTag("fetchShopData");

  const session = await getSession();
  const response = await apiRequest<Response>("/api/customer-orders", {
    token: session,
    tag: "fetcgCustomerOrders",
  });

  if (response?.error) throw new Error(response.error);

  const orders = response.message!;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
        mt: { md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <OrderList orders={orders} />
      </Container>
    </Box>
  );
}

export default Page;
