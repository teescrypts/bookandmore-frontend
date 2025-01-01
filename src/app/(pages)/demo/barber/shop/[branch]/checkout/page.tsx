import { Box, Container } from "@mui/material";
import React from "react";
import Checkout from "../../../components/shop/checkout";

function Page({ params }: { params: { branch: string } }) {
  return (
    <Box sx={{ mt: 25 }}>
      <Container maxWidth="lg">
        <Checkout branch={params.branch} />
      </Container>
    </Box>
  );
}

export default Page;
