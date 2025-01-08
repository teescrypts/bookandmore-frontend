"use client";

import React, { useEffect, useState } from "react";
import {
  FormControlLabel,
  Checkbox,
  Grid2,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Stack,
  Typography,
  Radio,
  Divider,
} from "@mui/material";
import Settings from "@/icons/untitled-ui/duocolor/settings";
import { styled, TextFieldProps } from "@mui/material";
import { SettingsType } from "../../settings/page";
import EmptyState from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import { useFormState } from "react-dom";
import { updateSettings } from "@/app/actions/actions";
import notify from "@/utils/toast";
import { staffPaths } from "@/paths";

const TextBox = styled((props: TextFieldProps) => <TextField {...props} />)`
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

interface PropType {
  settings: null | SettingsType;
}

const initialState: { error?: string; success?: string } | null = null;

const AppointmentBookingSettings: React.FC<PropType> = ({ settings }) => {
  const router = useRouter();

  if (!settings) {
    return (
      <EmptyState
        message="You have not set up your appointment settings"
        actionLabel="Set up now"
        onActionClick={() =>
          router.push(staffPaths.dashboard.booking.settings.setUp)
        }
      />
    );
  }

  const [feeTypeForCancel, setFeeTypeForCancel] = useState<string | null>(
    settings.policy.feeTypeForCancel
  );
  const [collectCancelFee, setCollectCancelFee] = useState(
    settings.policy.collectCancelFee
  );
  const [feeTypeForNoshow, setFeeTypeForNoshow] = useState<string | null>(
    settings.policy.feeTypeForNoshow
  );
  const [collectNoshowFee, setCollectNoshowFee] = useState(
    settings.policy.collectNoshowFee
  );

  const [message, setMessage] = useState("");
  const [state, formAction] = useFormState(updateSettings, initialState);

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.success) notify(state.success);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input name="id" defaultValue={settings._id} hidden />
      <Stack spacing={2}>
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12 }}>
            <Card>
              <CardHeader title="Policy" />
              <CardContent>
                <Grid2 container spacing={6}>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="collectCancelFee"
                          checked={collectCancelFee}
                          onChange={(e) => {
                            setCollectCancelFee(e.target.checked);
                            if (!e.target.checked) {
                              setFeeTypeForCancel(null);
                            }
                          }}
                        />
                      }
                      label="Collect Cancellation fee"
                    />

                    <Divider sx={{ my: 2 }} />

                    <Stack>
                      <FormControlLabel
                        control={
                          <Radio
                            name="fixedTypeCancel"
                            color="primary"
                            value="fixed"
                            checked={feeTypeForCancel === "fixed"}
                            onChange={(e) =>
                              setFeeTypeForCancel(e.target.value as "fixed")
                            }
                            disabled={!collectCancelFee}
                          />
                        }
                        label="Fixed cancellation fee"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            name="percentTypeCancel"
                            color="primary"
                            value="percent"
                            checked={feeTypeForCancel === "percent"}
                            onChange={(e) =>
                              setFeeTypeForCancel(e.target.value as "percent")
                            }
                            disabled={!collectCancelFee}
                          />
                        }
                        label="% based fee"
                      />
                    </Stack>

                    <Stack sx={{ my: 4 }}>
                      {feeTypeForCancel === "percent" && (
                        <TextField
                          required={
                            feeTypeForCancel === "percent" && collectCancelFee
                              ? true
                              : false
                          }
                          fullWidth
                          label="Percentage Of service booked"
                          type="number"
                          variant="outlined"
                          name="cancelFeeValuePercent"
                          defaultValue={
                            settings.policy.feeTypeForCancel === "percent" &&
                            settings.policy.cancelFeeValue
                          }
                          sx={{ mb: 2 }}
                          disabled={!collectCancelFee}
                          slotProps={{
                            input: {
                              inputProps: { min: 1, max: 100 },
                              endAdornment: "%",
                            },
                          }}
                        />
                      )}

                      {feeTypeForCancel === "fixed" && (
                        <TextField
                          fullWidth
                          label="Fixed cancellation fee"
                          required={
                            feeTypeForCancel === "fixed" && collectCancelFee
                              ? true
                              : false
                          }
                          type="number"
                          variant="outlined"
                          name="cancelFeeValueFixed"
                          defaultValue={
                            settings.policy.feeTypeForCancel === "fixed" &&
                            settings.policy.cancelFeeValue
                          }
                          sx={{ mb: 2 }}
                          disabled={!collectCancelFee}
                          slotProps={{ input: { startAdornment: "$" } }}
                        />
                      )}

                      {collectCancelFee && (
                        <TextBox
                          fullWidth
                          disabled={!collectCancelFee}
                          id="resheduling-id"
                          type="number"
                          name="cancellationNotice"
                          defaultValue={settings.policy.cancellationNotice}
                          label="Cancellation Notice In Hours"
                          variant="outlined"
                          slotProps={{
                            input: {
                              endAdornment: (
                                <Typography variant="subtitle2" color="primary">
                                  HOURS
                                </Typography>
                              ),
                            },
                          }}
                        />
                      )}
                    </Stack>
                  </Grid2>

                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="collectNoshowFee"
                          checked={collectNoshowFee}
                          onChange={(e) => {
                            setCollectNoshowFee(e.target.checked);
                            if (!e.target.checked) {
                              setFeeTypeForNoshow(null);
                            }
                          }}
                        />
                      }
                      label="Collect No-show fee"
                    />

                    <Divider sx={{ my: 2 }} />

                    <Stack>
                      <FormControlLabel
                        control={
                          <Radio
                            name="fixedTypeNoshow"
                            color="primary"
                            value="fixed"
                            checked={feeTypeForNoshow === "fixed"}
                            onChange={(e) =>
                              setFeeTypeForNoshow(e.target.value as "fixed")
                            }
                            disabled={!collectNoshowFee}
                          />
                        }
                        label="Fixed cancellation fee"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            name="percentTypeNoshow"
                            color="primary"
                            value="percent"
                            checked={feeTypeForNoshow === "percent"}
                            onChange={(e) =>
                              setFeeTypeForNoshow(e.target.value as "percent")
                            }
                            disabled={!collectNoshowFee}
                          />
                        }
                        label="% based fee"
                      />
                    </Stack>

                    <Stack sx={{ my: 4 }}>
                      {feeTypeForNoshow === "percent" && (
                        <TextBox
                          fullWidth
                          required={
                            feeTypeForNoshow === "percent" && collectNoshowFee
                              ? true
                              : false
                          }
                          label="Percentage Of service booked"
                          type="number"
                          variant="outlined"
                          name="noshowFeeValuePercent"
                          defaultValue={
                            settings.policy.feeTypeForNoshow === "percent" &&
                            settings.policy.noshowFeeValue
                          }
                          disabled={!collectNoshowFee}
                          slotProps={{
                            input: {
                              inputProps: { min: 1, max: 100 },
                              endAdornment: "%",
                            },
                          }}
                        />
                      )}

                      {feeTypeForNoshow === "fixed" && (
                        <TextField
                          fullWidth
                          required={
                            feeTypeForNoshow === "fixed" && collectNoshowFee
                              ? true
                              : false
                          }
                          label="Fixed cancellation fee"
                          type="number"
                          variant="outlined"
                          name="noshowFeeValueFixed"
                          defaultValue={
                            settings.policy.feeTypeForNoshow === "fixed" &&
                            settings.policy.noshowFeeValue
                          }
                          disabled={!collectNoshowFee}
                          slotProps={{ input: { startAdornment: "$" } }}
                        />
                      )}
                    </Stack>
                  </Grid2>
                </Grid2>
              </CardContent>
            </Card>
          </Grid2>

          {/* Lead Time */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader title="Lead Time" />
              <CardContent>
                <TextField
                  required
                  fullWidth
                  name="leadTime"
                  defaultValue={settings.leadTime}
                  label="Lead Time (hours)"
                  type="number"
                  variant="outlined"
                />
              </CardContent>
            </Card>
          </Grid2>

          {/* Booking Window */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader title="Booking Window" />
              <CardContent>
                <TextField
                  required
                  fullWidth
                  name="bookingWindow"
                  defaultValue={settings.bookingWindow}
                  label="Booking Window (days)"
                  type="number"
                  variant="outlined"
                />
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>

        <Typography variant="subtitle2" color="error" textAlign={"center"}>
          {message}
        </Typography>
        <Stack direction="row" justifyContent="flex-end">
          <SubmitButton
            title="Save settings"
            icon={<Settings />}
            isFullWidth={false}
          />
        </Stack>
      </Stack>
    </form>
  );
};

export default AppointmentBookingSettings;
