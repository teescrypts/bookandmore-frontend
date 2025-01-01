"use client";

import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Grid,
  Grid2,
} from "@mui/material";
import { styled } from "@mui/system";
import Link from "next/link";

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1.5, 4),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: "1rem",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const services = [
  "Professional Haircuts",
  "Beard Trimming & Grooming",
  "Hot Towel Shaves",
  "Relaxing Facials",
  "Custom Styling",
];

const BarberServicesList: React.FC = () => {
  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        backgroundColor: "#f5f5f5",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" component="h2" gutterBottom>
        Our Services
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        Premium grooming services tailored to your needs.
      </Typography>
      <Grid2 container spacing={4} justifyContent="center" alignItems="center">
        {/* Image Section */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box
            component="img"
            src="/assets/imgs/barber-tools.png"
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
          <List
            sx={{
              maxWidth: 400,
              margin: "0 auto",
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            {services.map((service, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={service} />
              </ListItem>
            ))}
          </List>
          <Link href={"/demo/barber/booking"}>
            <StyledButton variant="contained">BOOK APPOINTMENT</StyledButton>
          </Link>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default BarberServicesList;
