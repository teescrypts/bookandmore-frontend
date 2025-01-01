"use client";

import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { fetchCustomerSecret } from "@/app/actions/actions";
import { Box } from "@mui/material";

const stripePromise = loadStripe(
  "pk_test_51Pf9jVA9UXNeDBeWlIu4aYKO1FP8VOxzBs0ah0Q6Dt7lCHwxCzR8gj2ODaFIteFleKNz2dMbCjDoBxEFBPwRlJIl00Rk8ORztX",
  {}
);

function StripeSetupIntent() {
  const fetchClientSecret = useCallback(async () => {
    const bookingData = localStorage.getItem("bookingData");
    const result = await fetchCustomerSecret(JSON.parse(bookingData!));

    if (typeof result !== "string") {
      throw new Error(result?.error);
    }

    localStorage.removeItem("pendingBooking");
    localStorage.removeItem("bookingData");
    return result;
  }, []);

  const options = { fetchClientSecret };

  return (
    <Box>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </Box>
  );
}

export default StripeSetupIntent;
