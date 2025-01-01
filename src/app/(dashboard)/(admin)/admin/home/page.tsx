import { Box, Container, Stack, Typography } from "@mui/material";
import React from "react";
import Analytics from "../components/home/analytics";

function Page() {
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={"xl"}>
          <Stack spacing={2}>
            <Stack sx={{ mb: 2 }}>
              <Typography variant="h4">Overview</Typography>
            </Stack>
            <Analytics />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Page;
