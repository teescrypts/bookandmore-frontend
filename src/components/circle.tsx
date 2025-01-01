import { Box } from "@mui/material";
import React from "react";

function Circle({
  width = 25,
  height = 25,
  color,
}: {
  width?: number;
  height?: number;
  color: string;
}) {
  return (
    <Box
      sx={{
        width,
        height,
        backgroundColor: color,
        borderRadius: "50%",
      }}
    />
  );
}

export default Circle;
