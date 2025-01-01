"use client";

import { signup } from "@/app/actions/actions";
import { RouterLink } from "@/components/router-link";
import { SubmitButton } from "@/components/submit-button";
import ArrowBack from "@/icons/untitled-ui/duocolor/arrow-back";
import {
  Box,
  SvgIcon,
  Typography,
  Stack,
  TextField,
  Checkbox,
  Button,
  Link,
  FormControlLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";

const initialState: { error?: string } | null | undefined = null;

function Page() {
  const [state, formAction] = useFormState(signup, initialState);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
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
          <Typography variant="h5">Register</Typography>
          <Typography color="text.secondary" variant="body2">
            Already have an account? &nbsp;
            <Link href="/demo/login" underline="hover" variant="subtitle2">
              Log in
            </Link>
          </Typography>
        </Stack>
        <form action={formAction}>
          <Stack spacing={3}>
            <Typography variant="subtitle2" color="error">
              {message}
            </Typography>
            <TextField
              required
              variant="outlined"
              fullWidth
              label="First Name"
              name="fname"
            />
            <TextField
              required
              variant="outlined"
              fullWidth
              label="Last Name"
              name="lname"
            />
            <TextField
              required
              variant="outlined"
              fullWidth
              label="Email Address"
              name="email"
              type="email"
            />
            <TextField
              required
              variant="outlined"
              fullWidth
              label="Password"
              name="password"
              type="password"
            />
            <TextField
              required
              variant="outlined"
              fullWidth
              label="Confirm Password"
              name="cPassword"
              type="password"
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Referral code"
              name="referralCode"
              type="text"
            />
          </Stack>
          <Box sx={{ alignItems: "center", display: "flex", my: 2 }}>
            <FormControlLabel
              control={<Checkbox required name="policy" />}
              label="I have read the Terms and Conditions"
            />
          </Box>
          <SubmitButton title="Sign up" isFullWidth={true} />
        </form>
      </Box>
    </>
  );
}

export default Page;
