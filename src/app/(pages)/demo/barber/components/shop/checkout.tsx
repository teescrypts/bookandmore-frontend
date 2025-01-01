"use client";

import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { fetchClientSecretPayment } from "@/app/actions/actions";

const stripePromise = loadStripe(
  "pk_test_51Pf9jVA9UXNeDBeWlIu4aYKO1FP8VOxzBs0ah0Q6Dt7lCHwxCzR8gj2ODaFIteFleKNz2dMbCjDoBxEFBPwRlJIl00Rk8ORztX",
  {}
);

function Checkout({ branch }: { branch: string }) {
  const fetchClientSecret = useCallback(async () => {
    const result = await fetchClientSecretPayment(branch);

    if (result?.error) throw new Error(result.error);
    return result.success!;
  }, []);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

export default Checkout;
