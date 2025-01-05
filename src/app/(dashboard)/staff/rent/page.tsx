import ReusableTabs from "@/components/tab";
import { Box, Container, Stack, Typography } from "@mui/material";
import React from "react";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import RentSubscriptions from "../components/rent/rent-subscriptions";
import RentList from "../components/rent/rent-list";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Shop Rents",
  description: "Maanage Shop rent",
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

export interface Subscription {
  _id: string;
  name: string;
  stripeProductId: string;
  stripePriceId: string;
  active: Boolean;
  interval: "weekly" | "monthly";
  amount: number;
  description?: string;
}

async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await getSession();
  const response = await apiRequest<{
    message?: Subscription[];
    error?: string;
  }>("/api/subscriptions", {
    token: session,
    tag: "fetchSubscriptions",
  });

  if (response?.error) throw new Error(response.error);

  const subscriptions = response.message!;

  const tabLabels =
    searchParams?.tab && searchParams.tab === "subscription"
      ? ["Subscriptions", "Rents"]
      : ["Rents", "Subscriptions"];

  const tabContents =
    searchParams?.tab && searchParams.tab === "subscription"
      ? [
          <RentSubscriptions subscriptions={subscriptions} key={0} />,
          <RentList key={1} />,
        ]
      : [
          <RentList key={1} />,
          <RentSubscriptions subscriptions={subscriptions} key={0} />,
        ];

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={"lg"}>
        <Stack sx={{ mb: 2 }}>
          <Typography variant="h4">Rent</Typography>
        </Stack>
        <ReusableTabs tabLabels={tabLabels} tabContents={tabContents} />
      </Container>
    </Box>
  );
}

export default Page;
