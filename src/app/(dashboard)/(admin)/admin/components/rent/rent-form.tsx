import { Stack } from "@mui/material";
import React from "react";
import SubscriptionRentForm from "./subscription-rent-form";
import { Subscription } from "../../rent/page";

function RentForm({ subscriptions }: { subscriptions: Subscription[] }) {
  return (
    <Stack spacing={4}>
      <SubscriptionRentForm subscriptions={subscriptions} />
    </Stack>
  );
}

export default RentForm;
