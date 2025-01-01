import React, { ReactNode } from "react";
import TopNav from "./components/layout/top-nav";
import { styled, Theme } from "@mui/material";
import LayoutRoot from "./components/layout/layout-root";
import Footer from "./components/footer/footer";
import CustomTheme from "@/components/custom-theme";
import TopLoader from "@/components/top-loader";

function Layout({ children }: { children: ReactNode }) {
  return (
    <CustomTheme colorPreset="blue">
      <TopLoader />
      <TopNav />
      <LayoutRoot>
        <main>{children}</main>
        <Footer />
      </LayoutRoot>
    </CustomTheme>
  );
}

export default Layout;
