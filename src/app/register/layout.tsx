import { RouterLink } from "@/components/router-link";
import { Box, Container, Stack, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import LayoutRoot from "./components/layout-root";
import CustomTheme from "@/components/custom-theme";
import LayoutBox from "./components/layout-box";

const TOP_NAV_HEIGHT = 64;

function Layout({ children }: { children: ReactNode }) {
  return (
    <CustomTheme colorPreset="purple">
      <LayoutRoot
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <LayoutBox>
          <Container maxWidth="lg">
            <Stack direction="row" spacing={2} sx={{ height: TOP_NAV_HEIGHT }}>
              <Stack
                alignItems="center"
                component={RouterLink}
                direction="row"
                display="inline-flex"
                href={"/"}
                spacing={1}
                sx={{ textDecoration: "none" }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    height: 24,
                    width: 24,
                  }}
                >
                  <Typography variant="h6">B</Typography>
                </Box>
                <Box
                  sx={{
                    color: "text.primary",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: "0.3px",
                    lineHeight: 2.5,
                    "& span": {
                      color: "primary.main",
                    },
                  }}
                >
                  BarberDemo
                </Box>
              </Stack>
            </Stack>
          </Container>
        </LayoutBox>
        
        {children}
      </LayoutRoot>
    </CustomTheme>
  );
}

export default Layout;
