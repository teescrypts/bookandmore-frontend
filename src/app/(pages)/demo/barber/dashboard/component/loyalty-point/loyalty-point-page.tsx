"use client";

import React from "react";
import {
  ActivePromoCode,
  CustomerInfoPoints,
  CustomerLoyaltyPointsSettings,
} from "../../loyalty-point/page";
import EmptyState from "@/components/empty-state";
import LoyaltyPointsInfo from "./loyalty-point-info";

function LoyaltyPointPage({
  settings,
  customerInfo,
  activePromoCode,
}: {
  settings: CustomerLoyaltyPointsSettings | string;
  customerInfo: CustomerInfoPoints;
  activePromoCode: ActivePromoCode | null;
}) {
  if (typeof settings === "string") {
    return <EmptyState message={settings} />;
  }

  return (
    <LoyaltyPointsInfo
      activePromoCode={activePromoCode}
      settings={settings}
      customerInfo={customerInfo}
    />
  );
}

export default LoyaltyPointPage;
