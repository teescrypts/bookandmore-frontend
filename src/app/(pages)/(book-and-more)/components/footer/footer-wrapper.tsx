"use client";

import { Box, Theme, useTheme } from "@mui/material";
import React, { ReactNode } from "react";

function FooterWrapper({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        py: 4,
        borderTop: `4px solid ${theme.palette.primary.main}`,
      }}
    >
      {children}
    </Box>
  );
}

export default FooterWrapper;
