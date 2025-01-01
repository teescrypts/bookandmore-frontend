"use client";

import { login } from "@/app/actions/actions";
import { RouterLink } from "@/components/router-link";
import { SubmitButton } from "@/components/submit-button";
import ArrowBack from "@/icons/untitled-ui/duocolor/arrow-back";
import {
  Box,
  Stack,
  SvgIcon,
  Typography,
  TextField,
  Link,
  Alert,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";

const initialState:
  | {
      error: string;
      types:
        | { type: string; branch: { name: string; id: string } }[]
        | undefined;
    }
  | { error: string; types?: undefined }
  | null = null;

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

function Page() {
  const [message, setMessage] = useState("");
  const [state, formAction] = useFormState(login, initialState);
  const searchParams = useSearchParams();

  const loginReason = searchParams.get("reason");
  const fromOnboarding = searchParams.get("fromOnboarding");

  useEffect(() => {
    if (state) {
      if (state?.types && state?.error) {
        console.log(state.types, state.error);
      }

      if (!state?.types && state?.error) setMessage(state.error);
    }
  }, [state]);

  return (
    <>
      <Box sx={{ width: { xs: "100%", md: "60%" }, p: 2 }}>
        <Stack direction={"row"} spacing={1} sx={{ mb: 4 }}>
          <SvgIcon>
            <ArrowBack />
          </SvgIcon>
          <Link
            color="text.primary"
            component={RouterLink}
            href="/demo/barber"
            sx={{
              alignItems: "center",
              display: "inline-flex",
            }}
            underline="hover"
          >
            <Typography variant="subtitle2">Home Page</Typography>
          </Link>
        </Stack>
        <Stack sx={{ mb: 4 }} spacing={1}>
          <Typography variant="h5">Login</Typography>
          <Typography color="text.secondary" variant="body2">
            Don't have an account? &nbsp;
            <Link href="/demo/signup" underline="hover" variant="subtitle2">
              Sign up
            </Link>
          </Typography>
        </Stack>
        <form action={formAction}>
          <Stack spacing={3}>
            <Typography variant="subtitle2" color="error">
              {message}
            </Typography>
            {fromOnboarding && (
              <Alert severity="success" sx={{ textAlign: "center" }}>
                {fromOnboarding}
              </Alert>
            )}
            {loginReason && (
              <Alert severity="info" sx={{ textAlign: "center" }}>
                {loginReason}
              </Alert>
            )}
            <TextField
              variant="outlined"
              fullWidth
              label="Email Address"
              name="email"
              type="email"
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Password"
              name="password"
              type="password"
            />
          </Stack>

          <Stack sx={{ mt: 3 }}>
            <SubmitButton title="Login" isFullWidth={true} />
          </Stack>
        </form>
      </Box>
    </>
  );
}

export default Page;
