import React from "react";
import ProductPage from "../../../components/shop/product-page";
import apiRequest from "@/utils/api-request";
import { ValidCouponType } from "@/app/actions/action-types";

export interface CustomerProduct {
  _id: string;
  name: string;
  category: {
    name: string;
    taxCode: string;
  };
  description?: string;
  price: number;
  expiryDate?: string;
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
  stripeData?: {
    priceId?: string;
    productId?: string;
  };
}

interface Response {
  error?: string;
  message?: { product: CustomerProduct; validCoupons: ValidCouponType[] };
}

async function Page({ params }: { params: { id: string; branch: string } }) {
  const response = await apiRequest<Response>(`/api/shop/${params.id}`, {
    tag: "CustomerfetchProduct",
  });

  if (response?.error) throw new Error(response.error);

  const product = response.message!.product;
  const validCoupons = response.message!.validCoupons;

  return (
    <ProductPage
      branch={params.branch}
      product={product}
      validCoupons={validCoupons}
    />
  );
}

export default Page;
