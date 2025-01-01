import { addOpeningHours } from "@/app/actions/actions";
import { SubmitButton } from "@/components/submit-button";
import notify from "@/utils/toast";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";

const daysOfWeek = [
  { name: "sunday", label: "Sunday" },
  { name: "monday", label: "Monday" },
  { name: "tuesday", label: "Tuesday" },
  { name: "wednesday", label: "Wednesday" },
  { name: "thursday", label: "Thursday" },
  { name: "friday", label: "Friday" },
  { name: "saturday", label: "Saturday" },
];

const initialValue: { error?: string; success?: string } | null = null;

function AddOpeningHours({ onClose }: { onClose: () => void }) {
  const [state, formAction] = useFormState(addOpeningHours, initialValue);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.success) {
        notify("New Opening hours added");
        onClose();
      }
    }
  }, [state]);

  return (
    <form action={formAction}>
      <Box>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="day-select-label">Day of the Week</InputLabel>
          <Select name="day" labelId="day-select-label" label="Day of the Week">
            {daysOfWeek.map((day) => (
              <MenuItem key={day.name} value={day.name}>
                {day.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TimePicker label="From" name="from" />
            <TimePicker label="To" name="to" />
          </Stack>
        </LocalizationProvider>

        <Typography color="error" variant="subtitle2">
          {message}
        </Typography>

        <SubmitButton title="Add Time Slot" isFullWidth={true} />
      </Box>
    </form>
  );
}

export default AddOpeningHours;
