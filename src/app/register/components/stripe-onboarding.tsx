"use client";

import { useStripeConnect } from "@/hooks/use-stripe-connect";
import React, { useState } from "react";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { SplashScreen } from "@/components/_loading";
import SuccessfulOnboarding from "./successful-onboarding";

function StripeOnboarding({
  connectedAccountId,
}: {
  connectedAccountId: string;
}) {
  const [onboardingExited, setOnboardingExited] = useState(false);
  const stripeConnectInstance = useStripeConnect(connectedAccountId);

  if (onboardingExited) {
    return <SuccessfulOnboarding />;
  }

  if (stripeConnectInstance) {
    return (
      <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
        <ConnectAccountOnboarding onExit={() => setOnboardingExited(true)} />
      </ConnectComponentsProvider>
    );
  }

  return <SplashScreen />;
}

export default StripeOnboarding;
