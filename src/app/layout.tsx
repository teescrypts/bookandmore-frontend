import CustomTheme from "../components/custom-theme";
import { Metadata } from "next";

export const metadata: Metadata = {
  generator: "Impact illustration",
  applicationName: "Book and More",
  referrer: "origin-when-cross-origin",
  keywords: ["Booking", "E-commerce", "blog", "salon", "barber"],
  authors: [{ name: "impact" }, { name: "impact" }],
  creator: "impact illustration",
  publisher: "Impact illustration",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/placeholder-logo.jpg",
  },
  openGraph: {
    title: "Book and more",
    description: "Website to simplify small business owner's operations",
    type: "article",
    publishedTime: "2023-01-01T00:00:00.000Z",
    authors: ["Impact illustration"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <main>{children}</main>
      </body>
    </html>
  );
}
