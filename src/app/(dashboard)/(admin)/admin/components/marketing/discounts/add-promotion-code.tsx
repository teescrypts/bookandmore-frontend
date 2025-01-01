"use client";

import { addPromotionCode } from "@/app/actions/actions";
import { SubmitButton } from "@/components/submit-button";
import notify from "@/utils/toast";
import {
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";

const initialState: { error?: string; success?: string } | null = null;

function AddPromotionCode({
  selectedCoupon,
  selectedCouponStripeId,
  onClose,
}: {
  selectedCoupon: string;
  selectedCouponStripeId: string;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("");
  const [state, formAction] = useFormState(addPromotionCode, initialState);

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state.success) {
        onClose();
        notify(state.success);
      }
    }
  }, [state]);

  return (
    <form action={formAction}>
      <Typography variant="h6">New Promotion Code</Typography>
      <input value={selectedCoupon} name="coupon" hidden />
      <input value={selectedCouponStripeId} name="stripeId" hidden />

      <TextField
        variant="outlined"
        name="code"
        required
        fullWidth
        label="Promotion Code"
        sx={{ mt: 2 }}
      />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ width: "100%", mt: 2 }}
      >
        <Divider sx={{ flex: 1 }} />
        <Typography variant="subtitle1">Restrictions</Typography>
        <Divider sx={{ flex: 1 }} />
      </Stack>

      <FormControlLabel
        control={<Checkbox name="firstTransactionOnly" />}
        label="Limit to First Transaction Only"
        sx={{ mt: 2 }}
      />

      <TextField
        variant="outlined"
        name="maxRedemption"
        fullWidth
        type="number"
        label="Maximum redemption"
        sx={{ mt: 2 }}
      />

      <TextField
        variant="outlined"
        name="minimumAmount"
        fullWidth
        type="number"
        label="Minimum amount"
        sx={{ mt: 2 }}
      />

      <Typography color="error" variant="subtitle2">
        {message}
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mt: 3 }}
      >
        <SubmitButton title="Add promotion code" isFullWidth={false} />
      </Stack>
    </form>
  );
}

export default AddPromotionCode;
