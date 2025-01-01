import { Metadata } from "next";
import React from "react";
import OpeningHours from "../components/opening-hours/opening-hours";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";

export const metadata: Metadata = {
  title: "Opening Hours",
  description: "Upload the time you are available for booking",
  openGraph: {
    title: "Book and more",
    description: "The All in one website for small business owners",
    url: "https://bookandmore.live",
    siteName: "Book and more",
    images: [
      {
        url: "https://bookandmore.live/assets/", // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export interface TimeSlot {
  from: string;
  to: string;
}

export interface OpeningHoursType {
  id: string;
  owner: string;
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
  availability: "available" | "unavailable";
}

interface Response {
  error?: string;
  message?: OpeningHoursType;
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/opening-hours", {
    token: session,
    tag: "fetchOpeningHours",
  });

  if (response?.error) throw new Error(response.error);

  const openingHours = response.message!;

  return <OpeningHours openingHours={openingHours} />;
}

export default Page;
