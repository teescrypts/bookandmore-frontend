"use client";

import { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { useTheme } from "@mui/material";
import { fetchAccountId } from "@/app/actions/actions";

export const useStripeConnect = (connectedAccountId: string | undefined) => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState<any>();
  const theme = useTheme();

  useEffect(() => {
    if (connectedAccountId) {
      const fetchClientSecret = async () =>
        await fetchAccountId(connectedAccountId);

      setStripeConnectInstance(
        loadConnectAndInitialize({
          publishableKey:
            "pk_test_51Pf9jVA9UXNeDBeWlIu4aYKO1FP8VOxzBs0ah0Q6Dt7lCHwxCzR8gj2ODaFIteFleKNz2dMbCjDoBxEFBPwRlJIl00Rk8ORztX",
          fetchClientSecret,
          appearance: {
            overlays: "dialog",
            variables: {
              colorPrimary: theme.palette.primary.main,
            },
          },
        })
      );
    }
  }, [connectedAccountId]);

  return stripeConnectInstance;
};
