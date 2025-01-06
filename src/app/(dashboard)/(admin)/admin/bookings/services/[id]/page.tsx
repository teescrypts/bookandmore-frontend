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
import EditServiceForm from "../../components/services/edit-service";
import { ResolvingMetadata, Metadata } from "next";
import { adminPaths } from "@/paths";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import { ServiceType } from "../../components/services/services";
import { StaffTypeForService } from "../add/page";

export interface AddonType {
  _id: string;
  addonService: { _id: string; name: string };
  free: boolean;
  type: "product" | "service";
}

type ResponseType = {
  error?: string;
  message?: {
    service: ServiceType;
    addons: AddonType[];
    staffs: StaffTypeForService[];
  };
};

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
  const response = await apiRequest<ResponseType>(`/api/services/${id}`, {
    token: session,
  });

  let name = "Error";
  if (response?.message) {
    name = response.message.service.name;
  }

  // optionally access and extend (rather than replace) parent metadata
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

async function Page({ params }: { params: { id: string } }) {
  const session = await getSession();
  const response = await apiRequest<ResponseType>(
    `/api/services/${params.id}`,
    {
      token: session,
      tag: "fetchAServiceAndStaff",
    }
  );

  if (response?.error) throw new Error(response.error);

  const service = response.message!.service;
  const addons = response.message!.addons;
  const staffs = response.message!.staffs;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4">Edit Service</Typography>
            <Breadcrumbs separator={<BreadcrumbsSeparator />}>
              <Link
                color="text.primary"
                component={RouterLink}
                href={adminPaths.dashboard.booking.services}
                variant="subtitle2"
              >
                Services
              </Link>
              <Typography color="text.secondary" variant="subtitle2">
                Add
              </Typography>
            </Breadcrumbs>
          </Stack>
          <EditServiceForm staffs={staffs} service={service} addons={addons} />
        </Stack>
      </Container>
    </Box>
  );
}

export default Page;
