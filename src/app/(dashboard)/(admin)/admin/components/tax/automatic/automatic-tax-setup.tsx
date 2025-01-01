import { Stack, Divider } from "@mui/material";
import React from "react";
import TaxSettings from "./tax-settings";
import TaxRegistrations from "./tax-registrations";
import apiRequest from "@/utils/api-request";
import { getSession } from "@/utils/get-session";

interface Response {
  error?: string;
  message?: { _id: string; name: string }[];
}

async function AutomaticTaxSetup() {
  const session = await getSession();
  const result = await apiRequest<Response>("/api/taxes/locations", {
    token: session,
  });

  if (result.error) {
    throw new Error("Something went wrong. Please refresh");
  }

  const branches = result.message!;

  return (
    <Stack sx={{ my: 4 }}>
      <Stack spacing={6}>
        <TaxSettings branches={branches} />
        <Divider />
        <TaxRegistrations />
      </Stack>
    </Stack>
  );
}

export default AutomaticTaxSetup;
