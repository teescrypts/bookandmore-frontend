import React, { ReactNode } from "react";
import DemoLayout from "../../components/layout/demo-layout";
import { AuthProvider } from "@/app/authentication/frontend/auth-context";

function Layout({ children }: { children: ReactNode }) {
  return <DemoLayout>{children}</DemoLayout>;
}

export default Layout;
