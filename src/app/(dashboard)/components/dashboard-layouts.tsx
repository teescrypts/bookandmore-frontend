"use client";

import React, { ReactNode } from "react";
import { Bounce, ToastContainer } from "react-toastify";
import VerticalLayout from "./vertical-layout";
import { AuthProvider } from "@/app/authentication/dashboard/auth-context";
import CustomTheme from "@/components/custom-theme";
import { useTheme } from "@mui/material";
import { NavigationEvents } from "@/components/navigation";
import TopLoader from "@/components/top-loader";
import NoSsr from "@/components/no-ssr";

function DashboardLayout({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <CustomTheme colorPreset="blue">
      <AuthProvider>
        <VerticalLayout navColor="blend-in">
          <TopLoader />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme.palette.mode}
            transition={Bounce}
          />
          {children}
        </VerticalLayout>
      </AuthProvider>
    </CustomTheme>
  );
}

export default DashboardLayout;
