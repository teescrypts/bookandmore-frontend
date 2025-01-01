import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  TextField,
  Box,
  Container,
} from "@mui/material";
import React from "react";
import { registerAdmin } from "../actions/actions";
import { SubmitButton } from "@/components/submit-button";

function Page() {
  return (
    <Box
      sx={{
        flex: "1 1 auto",
        minHeight: "100%",
        my: { xs: 4, md: 0 },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: {
            xs: "60px",
            md: "120px",
          },
          textAlign: "center",
        }}
      >
        <Card elevation={16}>
          <CardHeader
            // subheader={
            //   <Typography color="text.secondary" variant="body2">
            //     Already have an account? &nbsp;
            //     <Link href="#" underline="hover" variant="subtitle2">
            //       Log in
            //     </Link>
            //   </Typography>
            // }
            sx={{ pb: 0 }}
            title="Create a demo account with your email"
            subheader="Account created will be deleted in 2Hrs"
          />
          <CardContent>
            <form action={registerAdmin}>
              <Stack spacing={3} sx={{ mb: 2 }}>
                {/* <TextField
                variant="outlined"
                fullWidth
                label="Name"
                name="name"
              /> */}
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                />
                {/* <TextField
                variant="outlined"
                fullWidth
                label="Password"
                name="password"
                type="password"
              /> */}
              </Stack>
              {/* <Box
              sx={{
                alignItems: "center",
                display: "flex",
                ml: -1,
                mt: 1,
              }}
            >
              <Checkbox name="policy" />
              <Typography color="text.secondary" variant="body2">
                I have read the{" "}
                <Link component="a" href="#">
                  Terms and Conditions
                </Link>
              </Typography>
            </Box> */}
              <SubmitButton title="Register" isFullWidth={true} />
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Page;
