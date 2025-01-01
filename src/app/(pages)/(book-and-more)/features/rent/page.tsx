import { Stack } from "@mui/material";
import React from "react";
import Banner from "../../components/banner";
import FeaturePage from "../../components/feature-page";

function Page() {
  return (
    <Stack spacing={6}>
      <Banner
        title="Efficiently Manage Rent Payments"
        subtitle="Offer flexible rent options with subscription-based payments, all managed through a streamlined system."
      />
      <FeaturePage
        title="Rent"
        description="Efficiently manage rent collection with preset subscription plans. Tenants can choose the payment method that works for them and have the ability to cancel subscriptions anytime through their own dashboard, giving them more control and convenience."
        image="/assets/imgs/rent.png"
      />
    </Stack>
  );
}

export default Page;
