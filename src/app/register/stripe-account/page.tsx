"use client";

import { Box, Container } from "@mui/material";
import React from "react";
import StripeOnboarding from "../components/stripe-onboarding";

function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  if (!searchParams) throw new Error("Invalid Operation");

  const connectedAccountId = searchParams.connectedAccountId as string;

  return (
    <Box
      sx={{
        flex: "1 1 auto",
        minHeight: "100%",
        my: { xs: 4, md: 0 },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: {
            xs: "60px",
            md: "120px",
          },
          textAlign: "center",
        }}
      >
        <StripeOnboarding connectedAccountId={connectedAccountId} />
      </Container>
    </Box>
  );
}

export default Page;
