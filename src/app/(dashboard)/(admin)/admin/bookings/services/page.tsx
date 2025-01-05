import React from "react";
import Services from "../components/services/services";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Metadata } from "next";
import Link from "next/link";
import Add from "@/icons/untitled-ui/duocolor/add";

export const metadata: Metadata = {
  title: "Manage services",
  description: "Manage the services you offers",
  openGraph: {
    title: "Book and more",
    description: "The All in one website for Barber brands and shops",
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

async function Page() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={"lg"}>
        <Stack
          justifyContent={"space-between"}
          direction={"row"}
          sx={{ mb: 6 }}
        >
          <Typography variant="h4">Services</Typography>
          <Stack>
            <Link href={"services/add"}>
              <Button startIcon={<Add />} variant="contained">
                Add New Service
              </Button>
            </Link>
          </Stack>
        </Stack>
        <Services />
      </Container>
    </Box>
  );
}

export default Page;
