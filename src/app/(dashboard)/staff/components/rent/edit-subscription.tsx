"use client";

import { SubmitButton } from "@/components/submit-button";
import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React from "react";
import { Subscription } from "../../rent/page";
import { useFormState } from "react-dom";
import { updateSubscription } from "@/app/actions/actions";
import Message from "./message";

const initialState: { error?: string; success?: string } | null = {};

function EditSubscription({ subscription }: { subscription: Subscription }) {
  const [state, formAction] = useFormState(updateSubscription, initialState);

  return (
    <form action={formAction}>
      <Stack spacing={2}>
        <Message state={state} />
        <input hidden name="id" value={subscription._id} />
        <TextField
          required
          fullWidth
          name="name"
          defaultValue={subscription.name}
          label="Subscription Name"
          variant="outlined"
          placeholder="For example; Monthly rent subscription"
          type="text"
        />

        <TextField
          multiline
          defaultValue={
            subscription.description ? subscription.description : ""
          }
          rows={3}
          name="description"
          label="Description"
          variant="outlined"
          type="text"
        />

        <FormControl fullWidth>
          <InputLabel id="interval">Duration</InputLabel>
          <Select
            required
            disabled
            labelId="interval"
            defaultValue={subscription.interval}
            id="interval-select"
            name="interval"
            label="Interval"
          >
            <MenuItem value={"week"}>Weekly</MenuItem>
            <MenuItem value={"month"}>Monthly</MenuItem>
          </Select>
        </FormControl>

        <TextField
          required
          disabled
          name="amount"
          defaultValue={subscription.amount}
          label="Price"
          variant="outlined"
          type="number"
          slotProps={{ input: { startAdornment: "$" } }}
        />

        <Stack direction={"row"} justifyContent={"flex-start"}>
          <SubmitButton title="Update subscription" isFullWidth={false} />
        </Stack>
      </Stack>
    </form>
  );
}

export default EditSubscription;
