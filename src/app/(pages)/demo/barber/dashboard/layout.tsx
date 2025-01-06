import React, { ReactNode } from "react";
import DemoLayout from "../../components/layout/demo-layout";

function Layout({ children }: { children: ReactNode }) {
  return <DemoLayout>{children}</DemoLayout>;
}

export default Layout;
