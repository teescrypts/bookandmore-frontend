"use client"

import { Box, alpha } from "@mui/material";
import React, { ReactNode } from "react";

function AvatarBox({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: (theme) => alpha(theme.palette.neutral[700], 0.5),
        borderRadius: "50%",
        color: "common.white",
        cursor: "pointer",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        left: 0,
        opacity: 0,
        position: "absolute",
        top: 0,
        width: "100%",
        zIndex: 1,
        "&:hover": {
          opacity: 1,
        },
      }}
    >
      {children}
    </Box>
  );
}

export default AvatarBox;
