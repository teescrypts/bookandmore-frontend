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
import EditSubscription from "../../components/rent/edit-subscription";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import { Subscription } from "../page";
import { staffPaths } from "@/paths";
import { ResolvingMetadata, Metadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  const session = await getSession();
  const response = await apiRequest<Response>(`/api/blogs/${id}`, {
    token: session,
    tag: "fetchBlog",
  });

  let name;
  if (response?.error) {
    name = "Error";
  } else {
    name = response.message!.name;
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

interface Response {
  error?: string;
  message?: Subscription;
}

async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await getSession();
  const response = await apiRequest<Response>(
    `/api/subscriptions/${params.id}`,
    {
      token: session,
    }
  );

  if (response?.error) throw new Error("Something went wrong. Please refresh");

  const subscription = response.message!;

  return (
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
            <Typography variant="h4">Edit Subscription</Typography>
            <Breadcrumbs separator={<BreadcrumbsSeparator />}>
              <Link
                color="text.primary"
                component={RouterLink}
                href={`${
                  staffPaths.dashboard.rent.index
                }?tab=${"subscription"}`}
                variant="subtitle2"
              >
                Rent
              </Link>
              <Typography color="text.secondary" variant="subtitle2">
                Edit
              </Typography>
            </Breadcrumbs>
          </Stack>
          <EditSubscription subscription={subscription} />
        </Stack>
      </Container>
    </Box>
  );
}

export default Page;
