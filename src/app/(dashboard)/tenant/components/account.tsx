"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Grid2,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { User } from "../account/page";
import { SubmitButton } from "@/components/submit-button";
import { useFormState } from "react-dom";
import {
  changePassword,
  manageBilling,
  updateInfo,
} from "@/app/actions/actions";
import notify from "@/utils/toast";
import { useUserData } from "@/app/authentication/dashboard/auth-context";
import { isTenant, TenantType } from "@/app/actions/action-types";
import formatDate from "@/utils/format-date";
import { useSearchParams } from "next/navigation";

interface PropType {
  user: User;
}

const initialState: { error?: string; success?: string } | null = null;

const AccountPage: React.FC<PropType> = ({ user }) => {
  const [infoUpdate, infoUpdateAction] = useFormState(updateInfo, initialState);
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    if (infoUpdate) {
      if (infoUpdate?.error) setInfoMessage(infoUpdate.error);
      if (infoUpdate?.success) notify("Details Updated");
    }
  }, [infoUpdate]);

  const [passowrdChange, passwordChangeAction] = useFormState(
    changePassword,
    initialState
  );
  const [passwordInfo, setPasswordInfo] = useState("");

  useEffect(() => {
    if (passowrdChange) {
      if (passowrdChange?.error) setPasswordInfo(passowrdChange.error);
      if (passowrdChange?.success) notify("Password Updated");
    }
  }, [passowrdChange]);

  const [rentStatus, setRentStatus] = useState<string | undefined>(undefined);
  const [stripeCustomer, setStripeCustomer] = useState<string | undefined>(
    undefined
  );
  const [paymentStatus, setPaymentStatus] = useState<string | undefined>(
    undefined
  );
  const [rentDueDate, setRentDueDate] = useState<number | undefined>(undefined);

  const { userData } = useUserData();

  useEffect(() => {
    if (userData && isTenant(userData)) {
      const rentStatus = userData!.rentStatus;
      setRentStatus(rentStatus.status);
      setPaymentStatus(rentStatus.paymentStatus);
      setStripeCustomer(rentStatus.stripeCustomer);
      setRentDueDate(rentStatus.dueOn);
    }
  }, [userData]);

  const [billingMsg, setBillingMsg] = useState("");

  const handleBilling = async (action: string) => {
    const result = await manageBilling(action);
    if (result?.error) setBillingMsg(result.error);
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("action-completed")) {
      notify("Subscription Updated succesfully");
    }
  }, [searchParams]);

  return (
    <Box>
      <form action={infoUpdateAction}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Update Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography color="error" variant="subtitle2">
                {infoMessage}
              </Typography>
              <TextField
                fullWidth
                label="First Name"
                name="fname"
                defaultValue={user.fname}
                variant="outlined"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Last Name"
                name="lname"
                defaultValue={user.lname}
                variant="outlined"
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                defaultValue={user.email}
                variant="outlined"
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <SubmitButton title="Update Details" isFullWidth={false} />
            </Grid2>
          </Grid2>
        </Paper>
      </form>

      {rentDueDate && rentStatus && paymentStatus && stripeCustomer ? (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Manage Rent Subscription
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography color="error" variant="subtitle2" textAlign={"center"}>
            {billingMsg}
          </Typography>

          <Typography textAlign={"center"} variant="subtitle1" color="info">
            Your rent is currently {rentStatus}. The due date for your next
            payment is {formatDate(rentDueDate)}
          </Typography>

          {paymentStatus !== "paid" && (
            <Alert severity="error">
              Your last subscription payment attempt was unsuccessful.
            </Alert>
          )}

          <Stack
            direction={"column"}
            spacing={2}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{ my: 2 }}
          >
            <Button
              onClick={() => handleBilling("cancel")}
              variant="contained"
              color="error"
            >
              Cancel Subscription
            </Button>
            <Button
              onClick={() => handleBilling("update")}
              variant="contained"
              color="primary"
            >
              Update Payment Method
            </Button>
          </Stack>
        </Paper>
      ) : (
        <Card>
          <CardContent>
            <Stack justifyContent={"center"} alignItems={"center"}>
              {" "}
              <CircularProgress />
            </Stack>
          </CardContent>
        </Card>
      )}

      <form action={passwordChangeAction}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <Typography color="error" variant="subtitle2">
                {passwordInfo}
              </Typography>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                name="oldPassword"
                variant="outlined"
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                name="newPassword"
                variant="outlined"
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                name="cNewPassword"
                variant="outlined"
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <SubmitButton title="Change Password" isFullWidth={false} />
            </Grid2>
          </Grid2>
        </Paper>
      </form>
    </Box>
  );
};

export default AccountPage;
