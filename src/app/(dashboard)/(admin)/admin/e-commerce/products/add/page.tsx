import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import CreateProduct from "../../components/product/create-product";
import { BreadcrumbsSeparator } from "@/components/breadcrumbs-separatr";
import { RouterLink } from "@/components/router-link";
import { Metadata } from "next";
import { adminPaths } from "@/paths";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";

export const metadata: Metadata = {
  title: "Add New Product",
  description: "Create a new product",
  openGraph: {
    title: "Book and more",
    description: "The All in one website for small business owners",
    url: "https://bookandmore.live",
    siteName: "Book and More",
    images: [
      {
        url: "https://bookandmore.live/assets/imgs/impact-logo.png", // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export interface DraftImage {
  url: string;
  imageId: string;
  fileName: string;
}

interface Response {
  error?: string;
  message?: DraftImage[];
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/products/image", {
    token: session,
    tag: "fetchDraftImages",
  });

  if (response?.error) throw new Error("Something went wrong, Please refresh");

  const draftImages = response.message!;

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h4">Create a new product</Typography>
              <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={adminPaths.dashboard.ecommerce.products}
                  variant="subtitle2"
                >
                  Product
                </Link>
                <Typography color="text.secondary" variant="subtitle2">
                  Create
                </Typography>
              </Breadcrumbs>
            </Stack>
            <CreateProduct draftImages={draftImages} />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Page;
