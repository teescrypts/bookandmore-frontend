"use client";

import React, { ReactNode } from "react";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { createTheme } from "@/theme";
import "@/global.css";
import { NavigationEvents } from "@/components/navigation";

type Config = {
  direction: "ltr" | "rtl";
  colorPreset: string;
  contrast: string;
  responsiveFontSizes: boolean;
  paletteMode: "dark" | "light" | undefined;
};

function CustomTheme({
  children,
  colorPreset,
}: {
  children: ReactNode;
  colorPreset: string;
}) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const config: Config = {
    direction: "ltr",
    colorPreset,
    contrast: "normal",
    responsiveFontSizes: true,
    paletteMode: prefersDarkMode ? "dark" : "light",
  };

  const theme = createTheme(config);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavigationEvents />
      {children}
    </ThemeProvider>
  );
}

export default CustomTheme;
