"use client";

import { changePassword } from "@/app/actions/actions";
import notify from "@/utils/toast";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";

const initialState: { error?: string; success?: string } = {};

function SecuritySettings() {
  const [state, formAction] = useFormState(changePassword, initialState);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (state.error) {
      setMessage("Unable to change password");
    } else if (state.success) {
      notify("Password changed");
    }
  }, [state]);

  return (
    <form action={formAction}>
      <Stack spacing={2}>
        <Card>
          <CardHeader title="Change Password" />
          <CardContent>
            <Stack spacing={2}>
              <Typography textAlign={"center"} variant="h6" color="error">
                {message}
              </Typography>
              <TextField
                name="oldPassword"
                label="Old Password"
                type="password"
                required
                variant="outlined"
              />
              <TextField
                name="newPassword"
                label="New Password"
                type="password"
                required
                variant="outlined"
              />
              <TextField
                name="cNewPassword"
                label="Retype New Password"
                type="password"
                required
                variant="outlined"
              />
              <Typography variant="body2">
                Forgot password? Click Here to change password
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Stack direction={"row"} justifyContent={"flex-end"}>
          <Button type="submit" variant="contained">
            Update Password
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}

export default SecuritySettings;
