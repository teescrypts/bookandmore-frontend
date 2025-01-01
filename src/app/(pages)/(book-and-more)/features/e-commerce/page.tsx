import { Stack } from "@mui/material";
import React from "react";
import Banner from "../../components/banner";
import FeaturePage from "../../components/feature-page";

function Page() {
  return (
    <Stack spacing={6}>
      <Banner
        title="Streamline Your Inventory and Boost Sales Online and In-Store"
        subtitle="Seamlessly manage product stock, sales, and orders across all channels to enhance customer experience and drive growth."
      />
      <FeaturePage
        title="E-commerce"
        description="Effortlessly manage orders and in-person sales from a single, intuitive dashboard. Easily organize your products and configure shipping settings, from pricing to delivery locations, to streamline your operations and ensure a smooth customer experience."
        image="/assets/imgs/e-commerce.png"
      />
    </Stack>
  );
}

export default Page;
