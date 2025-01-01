import React from "react";
import BarberHomeHero from "./components/home/barber-home-hero";
import BarberIntroSection from "./components/home/barber-intro-section";
import BarberServicesList from "./components/home/barber-service-list";
import BarberTrendingBlogs from "./components/home/barber-trending-blogs";
import BarberTopSellingProducts from "./components/home/barber-top-selling-product";
import PromoPopUp from "./components/promo-pop-up";
import apiRequest from "@/utils/api-request";
import { revalidateTag } from "next/cache";

export interface HomePageProductType {
  _id: string; // MongoDB's ObjectId as a string
  admin: string; // Admin's ObjectId as a string
  branch: string; // Branch's ObjectId as a string
  name: string;
  category: {
    name: string;
    taxCode: string;
  };
  description?: string;
  price: number;
  expiryDate?: string; // ISO date string
  SKU?: string;
  barcode?: string;
  sizeBasedQuantity?: {
    enabled: boolean;
    details?: {
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
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Blog Response Type
export interface HomeBlogType {
  _id: string; // MongoDB's ObjectId as a string
  admin: string; // Admin's ObjectId as a string
  branch: string; // Branch's ObjectId as a string
  title: string;
  shortDescription: string;
  author: string;
  estReadTime: string;
  content: string;
  coverImage: {
    url: string;
    fileName?: string;
    imageId: string;
  };
  engagements: {
    likes: number;
    comments: number;
    shares: number;
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface Response {
  error?: string;
  message?: { products: HomePageProductType[]; blogs: HomeBlogType[] };
}

async function Page() {
  const response = await apiRequest<Response>(
    "/api/shop/home-page/products/blogs/tests",
    {
      tag: "fetchHomepageData",
    }
  );

  if (response?.error) throw new Error(response.error);

  const products = response.message!.products;
  const blogs = response.message!.blogs;

  return (
    <>
      <BarberHomeHero />
      <BarberIntroSection />
      <BarberServicesList />
      {products.length > 0 && <BarberTopSellingProducts products={products} />}
      {blogs.length > 0 && <BarberTrendingBlogs blogs={blogs} />}
      <PromoPopUp />
    </>
  );
}

export default Page;
