import React from "react";
import Banner from "../components/banner";
import { Stack } from "@mui/material";
import HowItWorks from "../components/home-contents/home-how-it-works";

function Page() {
  return (
    <Stack spacing={6}>
      <Banner
        title="Launch Your Website in Just a Few Days!"
        subtitle="Your Complete Online Presence, Built in Record Time."
      />
      <HowItWorks />
    </Stack>
  );
}

export default Page;
