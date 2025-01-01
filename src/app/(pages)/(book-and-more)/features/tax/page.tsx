import { Stack } from "@mui/material";
import React from "react";
import Banner from "../../components/banner";
import FeaturePage from "../../components/feature-page";

function Page() {
  return (
    <Stack spacing={6}>
      <Banner
        title="Effortlessly Stay Tax Compliant"
        subtitle="Automate tax calculations and generate accurate reports, making it simple to keep your business in line with tax requirements."
      />
      <FeaturePage
        title="Tax"
        description="With our user-friendly dashboard, you can easily automate sales tax rate calculations based on your registered locations for collecting tax on products and services using Stripe."
        image="/assets/imgs/tax.png"
      />
    </Stack>
  );
}

export default Page;
