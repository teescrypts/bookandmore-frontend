"use client"

import { Box } from "@mui/material";
import React, { ReactNode } from "react";

function LayoutBox({ children }: { children: ReactNode }) {
  return (
    <Box
      component="header"
      sx={{
        left: 0,
        position: "fixed",
        right: 0,
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      {children}
    </Box>
  );
}

export default LayoutBox;
