export const dynamic = 'force-dynamic'

import React from "react";
import LoyaltyPointsPage from "../component/loyalty-point/loyalty-point-page";
import { Container } from "@mui/material";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";

interface Service {
  id: string;
  name: string;
}

export interface CustomerLoyaltyPointsSettings {
  active: boolean;
  monetaryEquivalent: number;
  enableReferral: boolean;
  enableAppointment: boolean;
  minimumAmountEnabledApt: boolean;
  minimumAmountApt?: number;
  appliesToApt: boolean;
  aptServiceIds?: Service[];
  enableProduct: boolean;
  minimumAmountEnabledProd: boolean;
  minimumAmountProd?: number;
  appliesToProd: boolean;
  prodServiceIds?: Service[];
}

export interface CustomerInfoPoints {
  loyaltyPoint: { total: number; redeemed: number };
  referralCode?: { value: string; count: number };
}

export interface ActivePromoCode {
  _id: string;
  code: string;
  coupon: {
    value: number;
  };
}

interface Response {
  error?: string;
  message?: {
    settings: CustomerLoyaltyPointsSettings | string;
    customerInfo: CustomerInfoPoints;
    activePromoCode: ActivePromoCode | null;
  };
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/customer-loyalty-point", {
    token: session,
    tag: "fetchCustomerLoyaltyPoint",
  });

  if (response?.error) throw new Error(response.error);

  const settings = response.message!.settings;
  const customerInfo = response.message!.customerInfo;
  const activePromoCode = response.message!.activePromoCode;

  return (
    <Container maxWidth="sm" sx={{ mt: { md: 25, xs: 5 } }}>
      <LoyaltyPointsPage
        settings={settings}
        customerInfo={customerInfo}
        activePromoCode={activePromoCode}
      />
    </Container>
  );
}

export default Page;
