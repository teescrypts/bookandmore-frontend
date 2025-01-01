import CustomTheme from "@/components/custom-theme";
import { Box, Stack } from "@mui/material";
import React, { ReactNode } from "react";
import AuthPaper from "./auth-paper";

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <CustomTheme colorPreset="green">
      <Box
        sx={{
          height: "100vh",
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          mt: { xs: 10, sm: 10, md: 0 },
        }}
      >
        <AuthPaper />
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{
            width: { xs: "100%", md: "80vw" },
            maxWidth: 600,
            p: 2,
          }}
        >
          {children}
        </Stack>
      </Box>
    </CustomTheme>
  );
}

export default AuthLayout;
