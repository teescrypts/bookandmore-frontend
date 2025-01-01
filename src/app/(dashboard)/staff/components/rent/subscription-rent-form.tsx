"use client";

import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Subscription } from "../../rent/page";
import EmptyState from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import notify from "@/utils/toast";
import { SubmitButton } from "@/components/submit-button";
import { addSubscriptionRentForm } from "@/app/actions/actions";
import { staffPaths } from "@/paths";

const inititalValue: { error?: string; success?: string } | null = {};

function SubscriptionRentForm({
  subscriptions,
}: {
  subscriptions: Subscription[];
}) {
  const router = useRouter();
  const [state, formAction] = useFormState(
    addSubscriptionRentForm,
    inititalValue
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.success) router.push(staffPaths.dashboard.rent.rentLinks);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <Stack spacing={2}>
        <Card>
          <CardHeader title="Subscription" />
          <CardContent>
            <Typography
              textAlign={"center"}
              sx={{ my: 2 }}
              variant="subtitle2"
              color="error"
            >
              {message}
            </Typography>
            {subscriptions.length > 0 ? (
              <Stack>
                <input hidden name="category" defaultValue={"subscription"} />
                <FormControl fullWidth>
                  <InputLabel id="subscription-id">
                    Preset Subscriptions
                  </InputLabel>
                  <Select
                    required
                    name="subscription"
                    labelId="subscription-id"
                    id="preset-subscription-id"
                    label="Preset Subscriptions"
                  >
                    {subscriptions.map((sub) => {
                      return (
                        <MenuItem key={sub._id} value={sub._id}>
                          {`${sub.name} - $ ${sub.amount}`}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Stack>
            ) : (
              <EmptyState
                message="You have not set up subscriptions"
                actionLabel="Add Subscription"
                onActionClick={() =>
                  router.push(
                    `${staffPaths.dashboard.rent.index}?tab=subscription`
                  )
                }
              />
            )}
          </CardContent>
        </Card>

        {subscriptions.length > 0 && (
          <Card>
            <CardHeader title="Tenant Details" />
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  name="fname"
                  label="First Name"
                  variant="outlined"
                  type="text"
                  required
                />
                <TextField
                  name="lname"
                  label="Last Name"
                  variant="outlined"
                  type="text"
                  required
                />
                <TextField
                  type="email"
                  required
                  name="email"
                  label="Email"
                  variant="outlined"
                />
              </Stack>
            </CardContent>
          </Card>
        )}

        {subscriptions.length > 0 && (
          <Card>
            <CardContent>
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={5}
                label="Note to tenant"
                name="note"
              />
            </CardContent>
          </Card>
        )}

        {subscriptions.length > 0 && (
          <Stack direction={"row"} justifyContent={"flex-end"}>
            <SubmitButton title="Create Form" isFullWidth={false} />
          </Stack>
        )}
      </Stack>
    </form>
  );
}

export default SubscriptionRentForm;
