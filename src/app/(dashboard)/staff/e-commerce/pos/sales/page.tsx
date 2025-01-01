import NoActiveBranch from "@/components/no-active-branch";
import apiRequest from "@/utils/api-request";
import { getSession } from "@/utils/get-session";
import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { Metadata } from "next";
import React from "react";
import SalesPage from "../../components/pos/sales-page";
import { BreadcrumbsSeparator } from "@/components/breadcrumbs-separatr";
import { RouterLink } from "@/components/router-link";
import { staffPaths } from "@/paths";

export const metadata: Metadata = {
  title: "Sales",
  description: "Overview of in-person sales",
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

export interface SaleProps {
  admin: string;
  branch: string;
  customer?: {
    fname: string;
    lname: string;
    email: string;
  };
  products: {
    product: {
      name: string;
    };
    quantity: number;
    size?: string;
    price: number;
  }[];
  totalAmount: number;
  totalDiscount: number;
  totalTax: number;
  paymentMethod: string;
  createdAt: string;
}

interface Response {
  error?: string;
  message?: SaleProps[];
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/pos/sale", {
    token: session,
    tag: "fetchPosSale",
  });

  if (response?.error) throw new Error(response.error);

  const sales = response.message!;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={"lg"}>
        <Stack spacing={1}>
          <Typography variant="h3">Sales</Typography>
          <Breadcrumbs separator={<BreadcrumbsSeparator />}>
            <Link
              color="text.primary"
              component={RouterLink}
              href={staffPaths.dashboard.ecommerce.pos}
              variant="subtitle2"
            >
              POS
            </Link>
            <Typography color="text.secondary" variant="subtitle2">
              Sales
            </Typography>
          </Breadcrumbs>
        </Stack>
        <SalesPage sales={sales} />
      </Container>
    </Box>
  );
}

export default Page;
