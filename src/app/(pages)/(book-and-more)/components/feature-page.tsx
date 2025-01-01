import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import Link from "next/link";
import React from "react";

interface FeaturePageProps {
  image: string;
  title: string;
  description: string;
}

function FeaturePage({ image, title, description }: FeaturePageProps) {
  return (
    <Stack alignItems={"center"}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 4,
            p: 4,
            borderRadius: 3,
          }}
        >
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{
              width: { xs: "100%", md: "50%" },
              borderRadius: 2,
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{ mb: 2, fontWeight: "bold" }}
            >
              {title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {description}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Link href={"/demo/barber"}>
                <Button variant="contained" size="small">
                  Try Customer Demo
                </Button>
              </Link>

              <Link href={"/register"}>
                <Button variant="contained" size="small">
                  Try Dashboard Demo
                </Button>
              </Link>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Stack>
  );
}

export default FeaturePage;
