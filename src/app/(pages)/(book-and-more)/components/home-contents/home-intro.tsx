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
      <Grid2 container spacing={4} justifyContent="center" alignItems="center">
        {/* Image Section */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box
            component="img"
            src="/assets/imgs/design1.png"
            alt="Barber Chair"
            sx={{
              width: "100%",
              // borderRadius: 2,
              // boxShadow: 3,
            }}
          />
        </Grid2>
        {/* List Section */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            <Typography color="textPrimary" variant="h6">
              Introducing bookAndMore: A Tailored Solution for Barber Businesses
            </Typography>
            <Typography color="textPrimary" variant="body1">
              bookAndMore is a cutting-edge demo website designed to meet the
              unique needs of modern barbershops. This platform streamlines
              operations with features such as appointment management, booth
              rent handling, tax integration, blog management, and support for
              multiple locations. It offers customizable opening hours to
              accommodate diverse schedules and includes powerful e-commerce
              marketing tools like discounts and loyalty points to boost
              customer engagement. For more details, explore the "How it Works"
              section to see everything bookAndMore can do for your business. To
              get started, message us on Instagram @impact_illustration1.
            </Typography>
          </Stack>
        </Grid2>
      </Grid2>
      </Container>
    </Box>
  );
}

export default HomeIntro;
