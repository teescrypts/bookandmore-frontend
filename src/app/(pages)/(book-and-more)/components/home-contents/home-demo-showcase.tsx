import React from "react";
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid2,
} from "@mui/material";
import Link from "next/link";

const demoData = [
  {
    title: "Pet Care",
    image: "/assets/imgs/pet-img.png",
    link: "/demo/pet",
  },
  {
    title: "Barbering",
    image: "/assets/imgs/barber-img.png",
    link: "/demo/barber",
  },
  {
    title: "Hairstyling",
    image: "/assets/imgs/hairstylist-img.png",
    link: "/demos/hairstylist",
  },
  {
    title: "Lashes",
    image: "/assets/imgs/lash.png",
    link: "/demos/lashes",
  },
];

function DemoShowcase() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}
      >
        Explore Our Demos
      </Typography>
      <Grid2 container spacing={4}>
        {demoData.map((demo, index) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardMedia
                component="img"
                height="250"
                image={demo.image}
                alt={`${demo.title} demo`}
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {demo.title}
                </Typography>
                <Link href={demo.link}>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Explore Demo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
}

export default DemoShowcase;
