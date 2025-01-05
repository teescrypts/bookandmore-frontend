import { Box, Container, Stack, Typography } from "@mui/material";
import React from "react";
import Analytics from "../components/home/analytics";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Overview",
  description: "Maanage Overview",
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

function Page() {
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={"xl"}>
          <Stack spacing={2}>
            <Stack sx={{ mb: 2 }}>
              <Typography variant="h4">Overview</Typography>
            </Stack>
            <Analytics />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Page;
