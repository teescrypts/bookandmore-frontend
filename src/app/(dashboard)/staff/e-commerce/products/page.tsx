export const dynamic = 'force-dynamic'

import React from "react";
import ProductList from "../components/product/product-list";
import { Metadata } from "next";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";

export const metadata: Metadata = {
  title: "Products",
  description: "Maanage Products",
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

export interface Product {
  _id: string;
  admin: string;
  branch: string;
  name: string;
  category: {
    name: string;
    taxCode: string;
  };
  description?: string;
  price: number;
  expiryDate?: Date;
  SKU?: string;
  barcode?: string;
  sizeBasedQuantity: {
    enabled: boolean;
    details?: {
      sizeType: string;
      quantity: number;
    }[];
  };
  quantity: number;
  images: {
    url: string;
    fileName: string;
    imageId: string;
  }[];
  sellOnlyWithAppointment?: boolean;
  discount: number;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Response {
  error?: string;
  message: Product[];
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/products", {
    token: session,
    tag: "fetchProducts",
  });

  if (response?.error) throw new Error(response.error);
  const products = response.message!;

  return <ProductList products={products} />;
}

export default Page;
