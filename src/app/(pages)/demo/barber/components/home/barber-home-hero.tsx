import React from "react";
import { Box, Button, Typography, Stack, Container } from "@mui/material";
import Image from "next/image";
import PlayArrow from "@/icons/untitled-ui/duocolor/play-arrow";
import Link from "next/link";

const BarberHomeHero: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: { xs: 4, md: 8 },
          px: { xs: 2, md: 6 },
          bgcolor: "background.default",
          color: "text.primary",
          flexDirection: { xs: "column", md: "row" },
          height: "70vh",
          mt: 15,
        }}
      >
        {/* Left Side: Text & Buttons */}
        <Box
          sx={{
            maxWidth: { md: "50%" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Your Style, Your Way
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Sit down, stand out with our exceptional barber services, blending
            tradition, creativity and personalized care. Experience a modern
            barbershop with top-notch services that cater to your unique style.
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            justifyContent={{ xs: "center", md: "flex-start" }}
            sx={{ mt: 4 }}
          >
            <Link href={"/demo/barber/booking"}>
              <Button variant="contained" color="primary" size="large">
                Book Appointment
              </Button>
            </Link>

            <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<PlayArrow />}
            >
              Watch Video
            </Button>
          </Stack>
        </Box>

        {/* Right Side: Optimized Image */}
        <Box
          sx={{
            mt: { xs: 4, md: 0 },
            width: { xs: "100%", md: "45%" },
            height: "auto",
            position: "relative",
          }}
        >
          <Image
            src="/assets/imgs/barber-banner-img.png"
            alt="Barber shop preview"
            layout="responsive"
            width={700}
            height={500}
            priority
            style={{ borderRadius: "8px" }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default BarberHomeHero;
