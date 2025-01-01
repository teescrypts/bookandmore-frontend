import { updateShippingOption } from "@/app/actions/actions";
import { SubmitButton } from "@/components/submit-button";
import notify from "@/utils/toast";
import {
  Stack,
  Divider,
  Box,
  Grid2,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ShippingOptionType } from "../../shipping/page";

const estimateUnits = ["business day", "day", "hour", "month", "week"];
const initialValue: { error?: string; success?: string } | null = null;

function EditShipping({
  shippingOption,
}: {
  shippingOption: ShippingOptionType;
}) {
  const [message, setMessaage] = useState("");
  const [state, formAction] = useFormState(updateShippingOption, initialValue);

  useEffect(() => {
    if (state) {
      if (state?.error) setMessaage(state.error);
      if (state?.success) {
        notify(state.success);
      }
    }
  }, [state]);

  return (
    <>
      <form action={formAction}>
        <Stack spacing={4} divider={<Divider />}>
          <Box>
            <Grid2 container spacing={3}>
              <Grid2 size={{ md: 6, xs: 12 }}>
                <input defaultValue={shippingOption._id} name="id" hidden />
                <TextField
                  defaultValue={shippingOption.displayName}
                  name="displayName"
                  variant="outlined"
                  fullWidth
                  label="Display Name"
                />
              </Grid2>
              <Grid2 size={{ md: 6, xs: 12 }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Amount"
                  defaultValue={shippingOption.amount}
                  name="amount"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={{ md: 6, xs: 12 }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  defaultValue={shippingOption.minEstimate}
                  name="minEstimate"
                  label="Minimum Delivery Estimate"
                  type="number"
                />
              </Grid2>
              <Grid2 size={{ md: 6, xs: 12 }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  defaultValue={shippingOption.maxEstimate}
                  name="maxEstimate"
                  label="Maximum Delivery Estimate"
                  type="number"
                />
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Select
                  name="unit"
                  defaultValue={
                    shippingOption.unit === "business_day"
                      ? "business day"
                      : shippingOption.unit
                  }
                  fullWidth
                  displayEmpty
                >
                  <MenuItem defaultValue="" disabled>
                    Select Unit
                  </MenuItem>
                  {estimateUnits.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </Grid2>
            </Grid2>
          </Box>
        </Stack>
        <Typography color="error" variant="subtitle2">
          {message}
        </Typography>
        <Stack sx={{ mt: 2 }}>
          <SubmitButton isFullWidth={false} title="Edit Shipping Option" />
        </Stack>
      </form>
    </>
  );
}

export default EditShipping;
