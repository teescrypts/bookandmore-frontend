"use client";

import {
  Stack,
  Typography,
  TextField,
  Box,
  Divider,
  Alert,
  FormControlLabel,
  Checkbox,
  Container,
} from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import { RentForm } from "../rent-forms/[id]/page";
import { rentFormSubscriptionPay } from "@/app/actions/actions";
import { SubmitButton } from "@/components/submit-button";
import { useFormState } from "react-dom";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Pf9jVA9UXNeDBeWlIu4aYKO1FP8VOxzBs0ah0Q6Dt7lCHwxCzR8gj2ODaFIteFleKNz2dMbCjDoBxEFBPwRlJIl00Rk8ORztX",
  {}
);

const initialValue: { error?: string; success?: string } | null = {};

function SubscriptionRentForm({ rentForm }: { rentForm: RentForm }) {
  const [message, setMessage] = useState("");
  const [clientSecret, setClientSecret] = useState<undefined | string>();
  const [state, formAction] = useFormState(
    rentFormSubscriptionPay,
    initialValue
  );

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.success) setClientSecret(state.success);
    }
  }, [state]);

  const tenantInfo = rentForm.tenantInfo;

  if (clientSecret) {
    return (
      <Box
        sx={{
          flex: "1 1 auto",
          minHeight: "100%",
          my: 8,
        }}
      >
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: "1 1 auto",
        minHeight: "100%",
        my: { xs: 4, md: 0},
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
        <form action={formAction}>
          <Stack spacing={2}>
            <Typography variant="h5" mb={2}>
              Booth Rent Form
            </Typography>

            {/* Admin Note */}
            <Typography variant="body1" mb={2} color="text.secondary">
              <strong>Note from Admin:</strong> {rentForm.note}
            </Typography>

            <input defaultValue={rentForm.admin} name="admin" hidden />
            <input defaultValue={rentForm.branch} name="branch" hidden />
            <input defaultValue={rentForm._id} name="id" hidden />
            <input
              defaultValue={rentForm.subscription?.stripePriceId}
              name="price"
              hidden
            />

            {/* Preset Details */}
            <TextField
              fullWidth
              variant="outlined"
              defaultValue={tenantInfo.fname}
              name="fname"
              label="First Name"
              slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              variant="outlined"
              defaultValue={tenantInfo.lname}
              fullWidth
              name="lname"
              label="Last Name"
              slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              variant="outlined"
              fullWidth
              name="email"
              label="Email"
              defaultValue={tenantInfo.email}
              slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Category"
              name="category"
              defaultValue={rentForm.category}
              slotProps={{ input: { readOnly: true } }}
            />

            <TextField
              variant="outlined"
              fullWidth
              label="Price"
              defaultValue={rentForm.subscription!.amount}
              slotProps={{ input: { startAdornment: "$", readOnly: true } }}
            />

            <TextField
              variant="outlined"
              fullWidth
              name="interval"
              label="Interval/Duration"
              defaultValue={rentForm.subscription!.interval === "week" ? 7 : 30}
              slotProps={{ input: { endAdornment: "DAYS", readOnly: true } }}
            />

            <Typography variant="subtitle2" color="primary">
              {rentForm.subscription!.description}
            </Typography>

            {/* Password Fields for Subscription */}

            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box
                display="flex"
                alignItems="center"
                width="100%"
                mt={2}
                mb={2}
              >
                <Divider sx={{ flex: 1 }} />

                <Typography variant="subtitle1" sx={{ marginX: 2 }}>
                  Create Password
                </Typography>

                <Divider sx={{ flex: 1 }} />
              </Box>
              <TextField
                variant="outlined"
                fullWidth
                defaultValue={""}
                name="password"
                label="Create Password"
                type="password"
                required
              />
              <TextField
                fullWidth
                variant="outlined"
                defaultValue={""}
                name="cPassword"
                label="Confirm Password"
                type="password"
                required
              />
            </Stack>

            <Box sx={{ maxWidth: "500px", width: "100%", mt: 2 }}>
              <Alert severity="info">
                This is a recurring payment. Your card will be charged
                automatically. You can cancel anytime from your dashboard.
              </Alert>
            </Box>

            {/* Confirmation */}
            <Box mt={3}>
              <FormControlLabel
                control={<Checkbox required name="confirmTermsAndInfo" />}
                label="I confirm the details are correct and I agree to the terms."
              />
            </Box>

            <Typography
              sx={{ my: 2 }}
              textAlign={"center"}
              color="error"
              variant="subtitle2"
            >
              {message}
            </Typography>

            <Stack sx={{ mt: 2 }}>
              <SubmitButton title="Proceed To Payment" isFullWidth={true} />
            </Stack>
          </Stack>
        </form>
      </Container>
    </Box>
  );
}

export default SubscriptionRentForm;
