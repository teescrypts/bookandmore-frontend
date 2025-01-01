import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

function SecuritySettings() {
  return (
    <form>
      <Stack spacing={2}>
        <Card>
          <CardHeader title="Change Password" />
          <CardContent>
            <Stack spacing={2}>
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
                name="retypedPassword"
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
          <Button variant="contained">Update Password</Button>
        </Stack>
      </Stack>
    </form>
  );
}

export default SecuritySettings;
