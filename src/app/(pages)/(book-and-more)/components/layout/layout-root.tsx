"use client"

import { styled, Theme } from "@mui/material";

const LayoutRoot = styled("div")(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.background.default,
    height: "100%",
  }));

  export default LayoutRoot