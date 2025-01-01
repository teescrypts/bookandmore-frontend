import React from "react";
import { Box, Container, Typography, Link, Grid2 } from "@mui/material";

const BarberFooter: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={4}>
          {/* About Section */}
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Typography variant="h6" gutterBottom>
              BarberDemo
            </Typography>
            <Typography variant="body2">
              Experience the best barber services tailored to your style. Your
              satisfaction is our priority.
            </Typography>
          </Grid2>

          {/* Quick Links */}
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link
              href="/about"
              color="inherit"
              underline="hover"
              sx={{ display: "block", mt: 1 }}
            >
              About Us
            </Link>
            <Link
              href="/services"
              color="inherit"
              underline="hover"
              sx={{ display: "block", mt: 1 }}
            >
              Services
            </Link>
            <Link
              href="/blog"
              color="inherit"
              underline="hover"
              sx={{ display: "block", mt: 1 }}
            >
              Blog
            </Link>
            <Link
              href="/shop"
              color="inherit"
              underline="hover"
              sx={{ display: "block", mt: 1 }}
            >
              Shop
            </Link>
            <Link
              href="/contact"
              color="inherit"
              underline="hover"
              sx={{ display: "block", mt: 1 }}
            >
              Contact
            </Link>
          </Grid2>

          {/* Contact & Social Media */}
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">
              123 Barber Street, Cityville
              <br />
              Email: info@barberdemo.com
              <br />
              Phone: (123) 456-7890
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">INSTAGRAM</Typography>
              <Typography variant="h6">TWITTER</Typography>
              <Typography variant="h6">YOUTUBE</Typography>
            </Box>
          </Grid2>
        </Grid2>

        <Box
          textAlign="center"
          sx={{ mt: 4, pt: 2, borderTop: "1px solid #555" }}
        >
          <Typography variant="body2" color="textSecondary">
            &copy; {new Date().getFullYear()} BarberDemo. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default BarberFooter;
