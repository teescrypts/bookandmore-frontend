import { NavigationEvents } from "@/components/navigation";
import DashboardLayout from "./components/dashboard-layouts";

export const metadata = {
  title: "Tenant dashboard",
  description: "Shope tenant dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
