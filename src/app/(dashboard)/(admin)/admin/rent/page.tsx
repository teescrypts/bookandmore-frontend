import ReusableTabs from "@/components/tab";
import { Box, Container, Stack, Typography } from "@mui/material";
import React from "react";
import RentSubscriptions from "../components/rent/rent-subscriptions";
import RentList from "../components/rent/rent-list";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import NoActiveBranch from "@/components/no-active-branch";

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

  if (typeof subscriptions === "string") {
    return <NoActiveBranch message={subscriptions} />;
  }

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
