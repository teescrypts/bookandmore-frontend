"use client";

import React from "react";
import { Box, Button, Typography, Stack, Container } from "@mui/material";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";

const shopImgs = [
  { src: "/assets/imgs/barber-shop-1.jpeg", alt: "Barbershop interior 1" },
  { src: "/assets/imgs/barber-shop-2.jpeg", alt: "Barbershop interior 2" },
  { src: "/assets/imgs/barber-shop-3.jpeg", alt: "Barbershop interior 3" },
];

const BarberIntroSection: React.FC = () => {
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
          py: { xs: 4, md: 8 },
          px: { xs: 2, md: 6 },
          bgcolor: "background.paper",
          my: 8,
        }}
      >
        {/* Left Side: Carousel */}
        <Box sx={{ width: { xs: "100%", md: "40%" }, mr: { md: 4 } }}>
          <Slider {...carouselSettings}>
            {shopImgs.map((shopImg) => {
              return (
                <Box>
                  <Image
                    src={shopImg.src}
                    alt={shopImg.alt}
                    layout="responsive"
                    width={600}
                    height={400}
                    style={{ borderRadius: "8px" }}
                  />
                </Box>
              );
            })}
          </Slider>
        </Box>

        {/* Right Side: Text & Button */}
        <Box
          sx={{
            maxWidth: { md: "45%" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome to Our Barbershop
          </Typography>
          <Typography variant="body1">
            Our barbershop is dedicated to providing a top-notch grooming
            experience. We take pride in maintaining a clean and hygienic
            environment, with tools that are sterilized after every use. Located
            conveniently, our shop is easily accessible, and our staff is
            well-trained, friendly, and committed to making your visit
            enjoyable. With a comfortable and fun atmosphere, you can relax and
            unwind while we ensure you leave looking your best.
          </Typography>
          <Link href={"/demo/barber/booking"}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 4 }}
            >
              Book Now
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default BarberIntroSection;
