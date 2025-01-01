"use client";

import React, { useState } from "react";

import { loadConnectAndInitialize } from "@stripe/connect-js";
import {
  ConnectPayments,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { useTheme } from "@mui/material";
import EmptyState from "@/components/empty-state";
import { fetchConnectedAccountClientSecret } from "@/app/actions/actions";

async function Finance() {
  const [message, setMessage] = useState<string | undefined>();
  const theme = useTheme();

  const [stripeConnectInstance] = useState(() => {
    const fetchClientSecret = async () => {
      const response = await fetchConnectedAccountClientSecret();

      if (response?.error) {
        const { error } = response;
        setMessage(error);
        return undefined;
      } else {
        const { client_secret: clientSecret } = response;
        return clientSecret;
      }
    };

    return loadConnectAndInitialize({
      publishableKey:
        "pk_test_51Pf9jVA9UXNeDBeWlIu4aYKO1FP8VOxzBs0ah0Q6Dt7lCHwxCzR8gj2ODaFIteFleKNz2dMbCjDoBxEFBPwRlJIl00Rk8ORztX",
      fetchClientSecret: fetchClientSecret as () => Promise<string>,
      appearance: {
        overlays: "dialog",
        variables: {
          colorPrimary: theme.palette.primary.main,
        },
      },
    });
  });

  if (message) {
    return <EmptyState message={message} />;
  }

  return (
    <div className="container">
      <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
        <ConnectPayments />
      </ConnectComponentsProvider>
    </div>
  );
}

export default Finance;
