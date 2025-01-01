import { ReactNode } from "react";
import AuthLayout from "./components/layout/auth-layout";

const Layout = (props: { children: ReactNode }) => {
  const { children } = props;

  return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;
