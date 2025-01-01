import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Grid2,
} from "@mui/material";

const pricingPackages = [
  {
    title: "Basic Package",
    installationFee: "$150",
    monthlyFee: "$29/month",
    benefits: [
      "Free Website Customization",
      "Free one-year domain subscription",
      "Free 6 months of technical support",
      "Free 2 months hosting",
    ],
    features: [
      "One location management",
      "Appointment booking and management",
      "Blog",
      "Marketing",
      "Unlimited staff management",
      "Unlimited rent management",
      "Tax management",
      "Online payment (cashapp, paypal, credit/debit card)",
    ],
  },
  {
    title: "Standard Package",
    installationFee: "$250",
    monthlyFee: "$50/month",
    benefits: [
      "Free Website Customization",
      "Free one-year domain subscription",
      "Free 6 months of technical support",
      "Free 2 months hosting",
    ],
    features: [
      "Unlimited location management",
      "E-commerce and Point of sales system",
      "Appointment booking and management",
      "Blog",
      "Marketing",
      "Unlimited staff management",
      "Unlimited rent management",
      "Tax management",
      "Online payment (cashapp, paypal, credit/debit card)",
    ],
  },
];

const PricingSection = () => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 4, fontWeight: "bold" }}
        >
          Our Pricing Packages
        </Typography>
        <Grid2 container spacing={4}>
          {pricingPackages.map((pkg, index) => (
            <Grid2 size={{ xs: 12, md: 6 }} key={index}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  boxShadow: 3,
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h5"
                    align="center"
                    sx={{ fontWeight: "bold", mb: 2 }}
                  >
                    {pkg.title}
                  </Typography>
                  <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                    One-time Installation Fee: {pkg.installationFee}
                  </Typography>
                  <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                    Hosting Fee: {pkg.monthlyFee}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    Benefits:
                  </Typography>
                  <List dense>
                    {pkg.benefits.map((benefit, i) => (
                      <ListItem key={i} disableGutters>
                        <ListItemText primary={benefit} />
                      </ListItem>
                    ))}
                  </List>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mt: 2, mb: 1 }}
                  >
                    Features Included:
                  </Typography>
                  <List dense>
                    {pkg.features.map((feature, i) => (
                      <ListItem key={i} disableGutters>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                {/* <Box sx={{ p: 2 }}>
                  <Button variant="contained" color="primary" fullWidth>
                    Get Started
                  </Button>
                </Box> */}
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
};

export default PricingSection;
