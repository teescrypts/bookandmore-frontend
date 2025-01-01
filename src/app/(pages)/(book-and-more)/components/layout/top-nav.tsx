"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  useMediaQuery,
  Theme,
  useTheme,
} from "@mui/material";
import FeaturesMenu from "./features-menu";
import Menu from "@/icons/untitled-ui/duocolor/menu";
import MobileNav from "./mobile-nav";
import Link from "next/link";

const TopNav = () => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleFeaturesClick = () => {
    setFeaturesOpen((prev) => !prev);
    setDrawerOpen(true);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.palette.background.default,
        boxShadow: "none",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Link href={"/"}>
              <Typography variant="h6" color="textPrimary">
                BookAndMore
              </Typography>
            </Link>

            <Chip label="v1.0.0" color="primary" />
          </Box>

          {mdUp ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <FeaturesMenu toggleDrawer={toggleDrawer} />
              <Button component="a" href="/pricing" sx={{ color: "#000" }}>
                Pricing
              </Button>
              <Button component="a" href="/how-it-works" sx={{ color: "#000" }}>
                How it Works
              </Button>
            </Box>
          ) : (
            <IconButton onClick={toggleDrawer(true)}>
              <Menu />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      <MobileNav
        featuresOpen={featuresOpen}
        toggleDrawer={toggleDrawer}
        handleFeaturesClick={handleFeaturesClick}
        drawerOpen={drawerOpen}
      />
    </AppBar>
  );
};

export default TopNav;
