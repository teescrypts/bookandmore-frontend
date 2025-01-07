import CustomTheme from "@/components/custom-theme";
import React, { ReactNode } from "react";
import BarberFooter from "./components/layout/barber-footer";
import BarberTopNav from "./components/layout/top-nav";
import TopLoader from "@/components/top-loader";
import { AuthProvider } from "@/app/authentication/frontend/auth-context";
import apiRequest from "@/utils/api-request";
import { revalidateTag } from "next/cache";
import NoSsr from "@/components/no-ssr";

export interface CustomerBranches {
  id: string;
  name: string;
  productCount: number;
}

interface Response {
  error?: string;
  message?: CustomerBranches[];
}

async function Layout({ children }: { children: ReactNode }) {
  // revalidateTag("fetchCustomerBranches")
  const response = await apiRequest<Response>("/api/shop/fetch/branches", {
    tag: "fetchCustomerBranches",
  });

  let branches;

  if (response?.error) {
    branches = response.error;
  } else {
    branches = response.message;
  }

  return (
    <CustomTheme colorPreset="green">
      <AuthProvider>
        <TopLoader />
        <BarberTopNav branches={branches} />
        {children}
        <BarberFooter />
      </AuthProvider>
    </CustomTheme>
  );
}

export default Layout;
