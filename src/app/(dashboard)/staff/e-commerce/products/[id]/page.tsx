export const dynamic = 'force-dynamic'

import { BreadcrumbsSeparator } from "@/components/breadcrumbs-separatr";
import { RouterLink } from "@/components/router-link";
import {
  Box,
  Container,
  Stack,
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";
import React from "react";
import EditProduct from "../../components/product/edit-product";
import { Metadata, ResolvingMetadata } from "next";
import apiRequest from "@/utils/api-request";
import { getSession } from "@/utils/get-session";
import { Product } from "../page";
import { staffPaths } from "@/paths";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

interface Response {
  error?: string;
  message: Product;
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  const session = await getSession();
  const response = await apiRequest<Response>(`/api/products/${id}`, {
    token: session,
    tag: "fetchProduct",
  });

  let name;
  if (response?.error) {
    name = "Error";
  } else {
    name = response.message.name;
  }
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: name,
    openGraph: {
      images: [
        "https://bookandmore.live/assets/imgs/impact-logo.png",
        ...previousImages,
      ],
    },
  };
}

async function page({ params }: { params: { id: string } }) {
  const session = await getSession();
  const response = await apiRequest<Response>(`/api/products/${params.id}`, {
    token: session,
    tag: "fetchProduct",
  });

  if (response?.error) throw new Error(response.error);

  const product = response.message!;

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
              <Typography variant="h4">Edit product</Typography>
              <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={staffPaths.dashboard.ecommerce.products}
                  variant="subtitle2"
                >
                  Product
                </Link>
                <Typography color="text.secondary" variant="subtitle2">
                  Edit
                </Typography>
              </Breadcrumbs>
            </Stack>
            <EditProduct product={product} />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default page;
