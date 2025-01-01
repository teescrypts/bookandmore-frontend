import React from "react";
import Banner from "../components/banner";
import { Box, Button, Stack, Typography } from "@mui/material";
import PricingSection from "../components/pricing/pricing-section";
import HowItWorks from "../components/home-contents/home-how-it-works";

function page() {
  return (
    <Stack spacing={6}>
      <Banner
        title="Flexible Pricing, Maximum Savings"
        subtitle="Tailored solutions that reduce maintenance expenses"
      />
      <PricingSection />
      <HowItWorks />
    </Stack>
  );
}

export default page;
