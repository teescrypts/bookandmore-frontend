"use client";

import DigitalOceanLogo from "@/components/digital-ocean";
import ImpactLogo from "@/components/impact-logo";
import { StripeLogo } from "@/components/stripe";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";

const HomeHero = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        textAlign: "center",
        my: 4,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          py: { xs: 10, md: 15 },
        }}
      >
        {/* Hero Text */}
        <Stack spacing={3} alignItems="center">
          <Typography
            variant="h2"
            color="textPrimary"
            sx={{ maxWidth: "600px" }}
          >
            Crafting Websites That Elevate Your Barber Shop
          </Typography>

          <Typography
            variant="body1"
            sx={{ maxWidth: "400px" }}
            color="textPrimary"
          >
            Empower your barber shop with a cutting-edge website tailored to
            meet your needs. From managing multiple locations and shop rentals
            to streamlining inventory, marketing, and tax operations, our
            solutions are designed to help you focus on what you do
            best—delivering exceptional service. Elevate your business with
            features crafted exclusively for barbers.
          </Typography>

          <Stack sx={{ my: 2 }} spacing={2}>
            <Typography variant="h6">Powered By;</Typography>
            <Stack direction={"row"} spacing={2}>
              <Button
                variant="outlined"
                size="large"
                startIcon={
                  <SvgIcon fontSize="large">
                    <StripeLogo />
                  </SvgIcon>
                }
              >
                Stripe
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={
                  <SvgIcon fontSize="large">
                    <DigitalOceanLogo />
                  </SvgIcon>
                }
              >
                Digital Ocean
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={
                  <SvgIcon fontSize="large">
                    <ImpactLogo />
                  </SvgIcon>
                }
              >
                Impact
              </Button>
            </Stack>
          </Stack>

          {/* Buttons */}

          <Box
            sx={{
              boxShadow: 3, // Adjust the shadow intensity (1-25)
              borderRadius: 2, // Optional: Add rounded corners
              overflow: "hidden", // Ensures the shadow respects the border radius
              display: "inline-block", // Keeps the Box size to fit the Image
            }}
          >
            <Image
              src="/assets/imgs/homepage-img.png"
              width={isMdUp ? 950 : 475}
              height={isMdUp ? 550 : 275}
              alt="dashboard"
            />
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Link href={"/demo/barber"}>
              <Button variant="contained" size="large">
                Try Customer Demo
              </Button>
            </Link>

            <Link href={"/register"}>
              <Button variant="contained" size="large">
                Try Dashboard Demo
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default HomeHero;
