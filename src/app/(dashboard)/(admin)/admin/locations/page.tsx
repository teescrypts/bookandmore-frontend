import React from "react";
import LocationManager from "../components/locations/location-manager";
import { Box, Container, Stack, Typography } from "@mui/material";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Locations",
  description: "Maanage Locations",
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

interface Address {
  line1: string;
  line2: string;
  country: {
    countryName: string;
    countryCode: string;
  };
  state: {
    stateName: string;
    stateCode: string;
  };
  city: {
    cityName: string;
    cityCode: string;
  };
  postalCode: string;
}

interface MessageType {
  _id: string;
  name: string;
  address: Address;
  opened: boolean;
  active: boolean;
}

interface ResponseOptions {
  message?: MessageType[];
  error?: string;
}

async function Page() {
  const session = await getSession();
  const data = await apiRequest<ResponseOptions>("/api/locations", {
    token: session,
    tag: "fetchLocations",
  });

  const branches = data.message;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={"lg"}>
        <Stack sx={{ mb: 2 }}>
          <Typography variant="h4">Locations</Typography>
        </Stack>
        <LocationManager branches={branches} />
      </Container>
    </Box>
  );
}

export default Page;
