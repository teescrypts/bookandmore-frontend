import { Stack } from "@mui/material";
import React from "react";
import Banner from "../../components/banner";
import FeaturePage from "../../components/feature-page";

function Page() {
  return (
    <Stack spacing={6}>
      <Banner
        title="Boost Customer Engagement with Strategic Discounts and Loyalty Points"
        subtitle="Drive sales and foster customer loyalty with targeted discounts and reward points, all managed easily from your dashboard."
      />
      <FeaturePage
        title="Marketing"
        description="Take full control of your marketing strategy by activating or deactivating discounts and loyalty points at key moments. Effortlessly generate coupon and promotion codes to unlock special offers for individual products or your entire catalog. Set up a loyalty points system where customers can earn points through referrals, booking services, or purchasing products. These points can then be redeemed for rewards, encouraging repeat business and boosting customer engagement."
        image="/assets/imgs/marketing.png"
      />
    </Stack>
  );
}

export default Page;
