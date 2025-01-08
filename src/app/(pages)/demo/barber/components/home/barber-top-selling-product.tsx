import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Grid2,
  Container,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import StoreFront from "@/icons/untitled-ui/duocolor/store-front";
import ShoppingCart01 from "@/icons/untitled-ui/duocolor/shopping-cart-01";
import { HomePageProductType } from "../../page";
import { API_BASE_URL } from "@/paths";

interface PropType {
  products: HomePageProductType[];
}

const BarberTopSellingProducts: React.FC<PropType> = ({ products }) => (
  <Container maxWidth="xl">
    <Box sx={{ py: 6, px: { xs: 2, md: 6 } }}>
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        Products
      </Typography>

      <Grid2 container spacing={4} justifyContent="center">
        {products.map((product) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
            <Card
              sx={{
                position: "relative",
                overflow: "visible",
                boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  height: 450,
                  overflow: "hidden",
                  borderRadius: "4px 4px 0 0",
                }}
              >
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // Ensures the image covers the box without distortion
                    objectPosition: "center", // Centers the image within the box
                  }}
                />
              </Box>

              <CardContent sx={{ padding: 3 }}>
                <Stack spacing={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {product.price} USD
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                </Stack>

                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  <Link href={`/demo/barber/shop/${product.branch}`} passHref>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<StoreFront />}
                      fullWidth
                      sx={{
                        borderColor: "#333",
                        color: "#333",
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                          borderColor: "#444",
                        },
                      }}
                    >
                      Shop Now
                    </Button>
                  </Link>

                  <Link
                    href={`/demo/barber/shop/${product.branch}/${product._id}`}
                    passHref
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ShoppingCart01 />}
                      fullWidth
                      sx={{
                        backgroundColor: "#333",
                        "&:hover": { backgroundColor: "#444" },
                      }}
                    >
                      Buy Now
                    </Button>
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  </Container>
);

export default BarberTopSellingProducts;
