"use client";

import { styled } from "@mui/material";

const LayoutRoot = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: "flex",
  backgroundPosition: "top center",
  flex: "1 1 auto",
  flexDirection: "column",
  height: "100%",
}));

export default LayoutRoot;
