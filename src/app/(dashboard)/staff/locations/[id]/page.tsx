import { BreadcrumbsSeparator } from "@/components/breadcrumbs-separatr";
import { RouterLink } from "@/components/router-link";
import { staffPaths } from "@/paths";
import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import { Metadata, ResolvingMetadata } from "next/types";
import EditLocation, {
  BranchType,
} from "../../components/locations/edit-location";

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
  const data = await apiRequest<{ message?: BranchType; error?: string }>(
    `/api/locations/${id}`,
    {
      token: session,
    }
  );

  if (data?.message) {
    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: data.message.name,
      openGraph: {
        images: [
          "https://bookandmore.live/assets/imgs/impact-logo.png",
          ...previousImages,
        ],
      },
    };
  } else {
    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: "Error",
      openGraph: {
        images: [
          "https://bookandmore.live/assets/imgs/impact-logo.png",
          ...previousImages,
        ],
      },
    };
  }
}

async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const session = await getSession();
  const response = await apiRequest<{ message?: BranchType; error?: string }>(
    `/api/locations/${id}`,
    {
      token: session,
      tag: "fetchBranch",
    }
  );

  if (response?.error) throw new Error("Something Went wrong. Please retry");

  const branch = response?.message;

  if (branch) {
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
                <Typography variant="h4">Edit Location</Typography>
                <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                  <Link
                    color="text.primary"
                    component={RouterLink}
                    href={staffPaths.dashboard.location}
                    variant="subtitle2"
                  >
                    Location
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Edit
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <EditLocation branch={branch!} />
            </Stack>
          </Container>
        </Box>
      </>
    );
  }
}

export default Page;
