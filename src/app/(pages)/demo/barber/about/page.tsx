import { Container } from "@mui/material";
import React from "react";
import BarberIntroSection from "../components/home/barber-intro-section";

function Page() {
  return (
    <Container maxWidth="lg" sx={{ mt: 20 }}>
      <BarberIntroSection />
    </Container>
  );
}

export default Page;
