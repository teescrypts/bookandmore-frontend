import React from "react";
import Orders from "../components/orders/orders";
import { Metadata } from "next";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";

export const metadata: Metadata = {
  title: "Orders",
  description: "Maanage Orders",
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

export type OrderType = {
  _id: string;
  customer: { _id: string; fname: string; lname: string }; // Reference to User (_id as a string)
  branch: string; // Reference to Branch (_id as a string)
  products: {
    product: { _id: string; name: string }; // Reference to Product (_id as a string)
    quantity: number;
    size?: string;
    price: number;
  }[];
  totalAmount: number; // Total price for the order
  totalDiscount: number; // Discount applied to the order
  totalShipping: number; // Shipping charges
  totalTax: number; // Tax amount
  shippingAddress: {
    line1: string; // First address line
    line2?: string; // Optional second address line
    city: string; // City
    state: string; // State
    postal_code: string; // Postal/ZIP code
    country: string; // Country
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"; // Current order status
  paymentStatus: "paid" | "unpaid" | "refunded"; // Payment status
  createdAt: string; // Timestamp for when the order was created
  updatedAt: string; // Timestamp for when the order was last updated
};

interface Response {
  error?: string;
  message?: OrderType[];
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/orders", {
    token: session,
    tag: "fetchOrders",
  });

  if (response?.error) throw new Error(response.error);

  const orders = response.message!;

  return <Orders orders={orders} />;
}

export default Page;
