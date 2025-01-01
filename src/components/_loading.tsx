import { CircularProgress, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CustomTheme from "./custom-theme";

export const SplashScreen = () => (
  <CustomTheme colorPreset="purple">
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        left: 0,
        p: 3,
        position: "fixed",
        top: 0,
        width: "100vw",
        zIndex: 1400,
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          height: 48,
          width: 48,
        }}
      >
        <Stack direction={"row"} spacing={2}>
          <Typography variant="h2">LOGO</Typography>
          <CircularProgress color="primary" />
        </Stack>
      </Box>
    </Box>
  </CustomTheme>
);
