import React from "react";
import apiRequest from "@/utils/api-request";
import {
  CustomerProductType,
  ValidCouponType,
} from "@/app/actions/action-types";
import ShopPage from "../../components/shop/shop-page";

export interface ShopDataResponse {
  error?: string;
  message?: {
    products: CustomerProductType[];
    total: number;
    validCoupons: ValidCouponType[];
    categories: string[];
  };
}

async function Page({ params }: { params: { branch: string } }) {
  const response = await apiRequest<ShopDataResponse>(
    `/api/shop/fetch/shop-data?branch=${params.branch}`,
    {
      tag: "fetchShopData",
    }
  );

  if (response?.error) throw new Error(response.error);

  const result = response.message!;
  const products = result.products;
  const validCoupon = result.validCoupons;
  const total = result.total;
  const categories = result.categories;

  return (
    <ShopPage
      branch={params.branch}
      products={products}
      total={total}
      validCoupon={validCoupon}
      categories={categories}
    />
  );
}

export default Page;
