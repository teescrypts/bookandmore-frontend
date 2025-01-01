import React from "react";
import AccountManager from "../components/account/account-manager";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Account",
  description: "Account settings",
  openGraph: {
    title: "Book and more",
    description: "The All in one website for small business owners",
    url: "https://bookandmore.live",
    siteName: "Book and More",
    images: [
      {
        url: "https://bookandmore.live/assets/", // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

async function Account() {
  return <AccountManager />;
}

export default Account;
