"use client";

import { updateTaxSettings } from "@/app/actions/actions";
import EmptyState from "@/components/empty-state";
import { SubmitButton } from "@/components/submit-button";
import Settings from "@/icons/untitled-ui/duocolor/settings";
import { adminPaths } from "@/paths";
import notify from "@/utils/toast";
import {
  Stack,
  Typography,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";

const taxBehaviors = ["exclusive", "inclusive", "automatic"];
const initialState: { error?: string; success?: string } | null = null;

function TaxSettings({
  branches,
  currentBehavior,
}: {
  branches: { _id: string; name: string }[];
  currentBehavior?: string | string[] | undefined;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [state, formAction] = useFormState(updateTaxSettings, initialState);

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.success) notify("Settings Updated");
    }
  }, [state]);

  if (branches && branches.length > 0) {
    return (
      <form action={formAction}>
        <Stack>
          <Typography color="error" textAlign={"center"} variant="h6">
            {message}
          </Typography>
          <Typography variant="h6">Tax Behavior</Typography>
          <Select
            required
            fullWidth
            name="tax_behavior"
            defaultValue={currentBehavior ? currentBehavior : ""}
          >
            {taxBehaviors.map((behavior) => (
              <MenuItem key={behavior} value={behavior}>
                {behavior}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Head Office
          </Typography>
          <RadioGroup aria-required name="head_office">
            {branches.map((branch) => {
              return (
                <FormControlLabel
                  key={branch._id}
                  value={branch._id}
                  control={<Radio />}
                  label={branch.name}
                />
              );
            })}
          </RadioGroup>

          <Stack sx={{ mt: 2 }} direction={"row"} justifyContent={"flex-start"}>
            <SubmitButton
              title="Update settings"
              isFullWidth={false}
              icon={<Settings />}
            />
          </Stack>
        </Stack>
      </form>
    );
  }

  return (
    <EmptyState
      message="You have not set up Any branch to use as head office"
      onActionClick={() => router.push(adminPaths.dashboard.location)}
      actionLabel="Set up branche's locations Now"
    />
  );
}

export default TaxSettings;
