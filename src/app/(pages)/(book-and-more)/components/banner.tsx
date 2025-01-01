"use client";

import { Box, Button, Paper, Stack, Typography, useTheme } from "@mui/material";
import Link from "next/link";

function Banner({ title, subtitle }: { title: string; subtitle: string }) {
  const theme = useTheme();

  return (
    <Paper
      elevation={5}
      sx={{
        position: "relative",
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        textAlign: "center",
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Stack spacing={2} alignItems={"center"}>
        <Box sx={{ maxWidth: { md: 600 }, p: { sm: 2, xs: 2 } }}>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="subtitle1">{subtitle}</Typography>
        </Box>

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
      </Stack>
    </Paper>
  );
}

export default Banner;
