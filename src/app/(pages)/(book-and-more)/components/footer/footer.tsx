import {
  Box,
  Container,
  Grid2,
  Link,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import FooterWrapper from "./footer-wrapper";

const Footer = () => {
  return (
    <FooterWrapper>
      <Container maxWidth="lg">
        {/* Logo and Brief Description */}
        <Grid2 container spacing={4} justifyContent="space-between">
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography color="textPrimary" variant="h5">
              BookAndMore
            </Typography>
            <Typography color="textPrimary" variant="body2" sx={{ mt: 2 }}>
              A comprehensive solution for managing bookings, e-commerce, blogs,
              and more—all tailored to suit your needs.
            </Typography>
          </Grid2>

          {/* Navigation Links */}
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography color="textPrimary" variant="h6" sx={{ mb: 2 }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link href="/" color="textPrimary" underline="hover">
                Home
              </Link>
              <Link href="/features" color="textPrimary" underline="hover">
                Features
              </Link>
              <Link href="/pricing" color="textPrimary" underline="hover">
                Pricing
              </Link>
              <Link href="/contact" color="textPrimary" underline="hover">
                Contact Us
              </Link>
            </Stack>
          </Grid2>

          {/* Social Media Icons */}
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography color="textPrimary" variant="h6" sx={{ mb: 2 }}>
              Follow Us
            </Typography>
            <Stack direction="column" spacing={2}>
              <Link href="#" color="textPrimary" underline="hover">
                INSTAGRAM
              </Link>

              <Link href="#" color="textPrimary" underline="hover">
                GITHUB
              </Link>
            </Stack>
          </Grid2>
        </Grid2>

        {/* Divider and Copyright */}
        <Divider sx={{ my: 4, borderColor: "#757575" }} />
        <Typography
          color="textPrimary"
          variant="body2"
          align="center"
          sx={{ fontSize: "0.875rem" }}
        >
          &copy; {new Date().getFullYear()} Impact Illustration. All rights
          reserved.
        </Typography>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
