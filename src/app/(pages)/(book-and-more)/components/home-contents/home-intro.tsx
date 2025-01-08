"use client";

import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import React from "react";

function HomeIntro() {
  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        backgroundColor: "#f5f5f5",
        textAlign: "center",
      }}
    >
      <Container maxWidth={"xl"}>
        <Grid2
          container
          spacing={4}
          justifyContent="center"
          alignItems="center"
        >
          {/* Image Section */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src="/assets/imgs/design1.png"
              alt="Barber Chair"
              sx={{
                width: "100%",
              }}
            />
          </Grid2>
          {/* List Section */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography color="textPrimary" variant="h6">
                Introducing bookAndMore: A Tailored Solution for Barber
                Businesses
              </Typography>
              <Typography color="textPrimary" variant="body1">
                bookAndMore is a demo website showcasing features tailored for
                modern barbershops, such as appointment management, booth rent
                handling, tax integration, blog management, and multi-location
                support. It also highlights customizable opening hours,
                marketing tools like discounts and loyalty points, e-commerce
                for online sales, and an inbuilt POS for in-person transactions.
                <br /> <br />
                While the demo previews these features, customization isn’t
                limited to what’s displayed. bookAndMore can be tailored to your
                specific needs—whether for managing appointments or running an
                academy. For details, check "How it Works" or message us on
                Instagram @impact_illustration1.
              </Typography>
            </Stack>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}

export default HomeIntro;
