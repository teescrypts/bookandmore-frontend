import { Stack } from "@mui/material";
import React from "react";
import Banner from "../../components/banner";
import FeaturePage from "../../components/feature-page";

function Page() {
  return (
    <Stack spacing={6}>
      <Banner
        title="Manage Staff Commissions and Permissions with Ease"
        subtitle="Set up staff roles, track commissions, and control access levels—all from a centralized dashboard."
      />
      <FeaturePage
        title="Staff"
        description="Add staff members with customized permission levels to your dashboard, ensuring the right access for each role. Easily set up commission-based staff and automate direct transfers of commissions to their registered bank accounts."
        image="/assets/imgs/staff.png"
      />
    </Stack>
  );
}

export default Page;
