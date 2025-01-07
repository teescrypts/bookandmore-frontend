export const dynamic = "force-dynamic";

import { ValidCouponType } from "@/app/actions/action-types";
import apiRequest from "@/utils/api-request";
import { getSession } from "@/utils/get-session";
import React from "react";
import CartPage from "../../../components/shop/cart";
import EmptyState from "@/components/empty-state";

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: { url: string }[];
    sizeBasedQuantity: {
      enabled: boolean;
      details: { sizeType: string; quantity: number }[];
    };
  };
  quantity: {
    sizeBasedQuantity: {
      enabled: boolean;
      size: string;
    };
    value: number;
  };
  branch: string;
  status: string;
}

interface Response {
  error?: string;
  messaage?: { cartItems: CartItem[]; validCoupons: ValidCouponType[] };
}

async function page({ params }: { params: { branch: string } }) {
  const session = await getSession();
  const response = await apiRequest<Response>(
    `/api/cart-item?branch=${params.branch}`,
    {
      token: session,
      tag: "fetchCartItems",
    }
  );

  if (response?.error) {
    if (response.error !== "Please authenticate.")
      if (response?.error) return <EmptyState message={response.error} />;
  }

  const validCoupons = response.messaage?.validCoupons || [];
  const cartItems = response.messaage?.cartItems || [];

  return (
    <CartPage
      branch={params.branch}
      cartItems={cartItems}
      validCoupons={validCoupons}
    />
  );
}

export default page;
