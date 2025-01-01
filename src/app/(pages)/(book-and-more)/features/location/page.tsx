import { Stack } from "@mui/material";
import React from "react";
import Banner from "../../components/banner";
import FeaturePage from "../../components/feature-page";

function Page() {
  return (
    <Stack spacing={6}>
      <Banner
        title="Manage Multiple Branches from a Single Dashboard"
        subtitle="Oversee operations, staff, and performance across all your branches with one centralized, easy-to-use dashboard."
      />
      <FeaturePage
        title="Location"
        description="Seamlessly manage multiple locations from a single dashboard. Control everything from services and opening hours to inventory, marketing, rent, staff, and tax settings. Keep all branches running smoothly and efficiently with centralized management at your fingertips."
        image="/assets/imgs/locations.png"
      />
    </Stack>
  );
}

export default Page;
