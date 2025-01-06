import React from "react";
import BookingPage from "../components/booking/booking-page";
import apiRequest from "@/utils/api-request";
import { revalidateTag } from "next/cache";

export interface BranchType {
  _id: string;
  name: string;
  timeZone: string;
  address: {
    line1: string;
    line2?: string;
    city: {
      cityName: string;
      cityCode: string;
    };
    state: {
      stateName: string;
      stateCode: string;
    };
    country: {
      countryName: string;
      countryCode: string;
    };
    postalCode: string;
  };
  opened: boolean;
}

interface Response {
  error?: string;
  message?: BranchType[];
}

async function Page() {
  const response = await apiRequest<Response>("/api/bookings/fetch/locations", {
    tag: "fetchLocations",
  });

  if (response?.error) throw new Error(response.error);

  const locations = response.message!;

  return <BookingPage locations={locations} />;
}

export default Page;
