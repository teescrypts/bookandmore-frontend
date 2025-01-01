import { Container } from "@mui/material";
import React from "react";
import BarberServicesList from "../components/home/barber-service-list";

function Page() {
  return (
    <Container maxWidth="xl" sx={{ mt: 20 }}>
      {" "}
      <BarberServicesList />{" "}
    </Container>
  );
}

export default Page;
