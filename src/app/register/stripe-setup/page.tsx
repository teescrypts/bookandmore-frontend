import { Box, Container } from "@mui/material";
import React from "react";
import StripeSetupIntent from "../components/stripe-setup-intent";

function Page() {
  return (
    <Box
      sx={{
        // flex: "1 1 auto",
        minHeight: "100%",
        my: { xs: 4, md: 0 },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          py: {
            xs: "60px",
            md: "120px",
          },
        }}
      >
        <StripeSetupIntent />
      </Container>
    </Box>
  );
}

export default Page;
