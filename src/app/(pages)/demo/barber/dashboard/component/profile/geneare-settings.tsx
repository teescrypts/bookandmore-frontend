"use client";

import User01 from "@/icons/untitled-ui/duocolor/user01";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid2,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/system/colorManipulator";
import React, { ChangeEvent, useEffect, useState } from "react";
import { ClientData } from "../../profile/page";
import { updateInfo, uploadAvatar } from "@/app/actions/actions";
import notify from "@/utils/toast";
import { useFormState } from "react-dom";
import { useClientData } from "@/app/authentication/frontend/auth-context";
import Camera from "@/icons/untitled-ui/duocolor/camera";
import AvatarBox from "@/app/(dashboard)/staff/components/account/avatar-box";
import { SubmitButton } from "@/components/submit-button";

const initialState: { error?: string; success?: string } = {};

function GeneralSettings({ user }: { user: ClientData }) {
  const [message, setMessage] = useState("");
  const [state, formAction] = useFormState(updateInfo, initialState);
  const [file, setFile] = useState<File | undefined>(undefined);

  const { getUserData } = useClientData();

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();

    if (e.target.files) {
      formData.append(e.target.name, e.target.files[0]);
      const response = await uploadAvatar(formData);
      if (response?.error) setMessage(response.error);
      setFile(e.target.files[0]);
      notify("Picture Uploaded Successfully");
      getUserData();
    }
  };

  useEffect(() => {
    if (state.success) {
      notify("Details Updated");
    } else if (state.error) {
      setMessage("Something went wrong. Please try again");
    }
  }, [state]);

  return (
    <Stack spacing={4}>
      <Card>
        <CardContent>
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="h6">Basic details</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Box
                    sx={{
                      borderColor: "neutral.300",
                      borderRadius: "50%",
                      borderStyle: "dashed",
                      borderWidth: 1,
                      p: "4px",
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: "50%",
                        height: "100%",
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      <AvatarBox>
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <SvgIcon color="inherit">
                            <Camera />
                          </SvgIcon>
                        </Stack>
                      </AvatarBox>
                      <Avatar
                        src={file ? URL.createObjectURL(file) : user.avatar}
                        sx={{
                          height: 100,
                          width: 100,
                        }}
                      >
                        <SvgIcon>
                          <User01 />
                        </SvgIcon>
                      </Avatar>
                    </Box>
                  </Box>
                  <TextField
                    name="avatar"
                    type="file"
                    sx={{
                      display: "none",
                    }}
                    slotProps={{
                      input: { inputProps: { accept: "image/*" } },
                    }}
                    id="file-input"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleAvatarChange(e)
                    }
                  />
                  <label htmlFor="file-input">
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                      sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                      }}
                    >
                      Upload
                    </Button>
                  </label>
                </Stack>

                <Stack textAlign={"center"}>
                  <Typography variant="h6" color="error">
                    {message}
                  </Typography>
                </Stack>

                <form action={formAction}>
                  <Stack spacing={2}>
                    <TextField
                      variant="outlined"
                      name="fname"
                      defaultValue={user.fname}
                      label="First Name"
                      sx={{ flexGrow: 1 }}
                    />

                    <TextField
                      variant="outlined"
                      name="lname"
                      defaultValue={user.lname}
                      label="last Name"
                      sx={{ flexGrow: 1 }}
                    />

                    <TextField
                      variant="outlined"
                      name="email"
                      defaultValue={user.email}
                      label="Email Address"
                      sx={{ flexGrow: 1 }}
                    />

                    <Stack direction={"row"} justifyContent={"flex-start"}>
                      <SubmitButton
                        title="Update profile"
                        isFullWidth={false}
                      />
                    </Stack>
                  </Stack>
                </form>
              </Stack>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default GeneralSettings;
