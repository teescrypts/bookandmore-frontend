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
import { useFormState } from "react-dom";
import { setUpSettings } from "@/app/actions/actions";
import { SubmitButton } from "@/components/submit-button";
import { useRouter } from "next/navigation";
import { adminPaths } from "@/paths";

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

const initialState: { error?: string; success?: string } | null = null;

const SetUp: React.FC = () => {
  const [feeTypeForCancel, setFeeTypeForCancel] = useState("");
  const [collectCancelFee, setCollectCancelFee] = useState(false);
  const [feeTypeForNoshow, setFeeTypeForNoshow] = useState("");
  const [collectNoshowFee, setCollectNoshowFee] = useState(false)
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [state, formAction] = useFormState(setUpSettings, initialState);

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.success)
        router.push(adminPaths.dashboard.booking.settings.index);
    }
  }, [state]);

  return (
    <form action={formAction}>
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
                              setFeeTypeForCancel("");
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
                              setFeeTypeForCancel(e.target.value)
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
                              setFeeTypeForCancel(e.target.value)
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
                          disabled={!collectCancelFee}
                          sx={{ mb: 2 }}
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
                          disabled={!collectCancelFee}
                          sx={{ mb: 2 }}
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
                              setFeeTypeForNoshow("");
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
                              setFeeTypeForNoshow(e.target.value)
                            }
                            disabled={!collectNoshowFee}
                          />
                        }
                        label="Fixed No-show fee"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            name="percentTypeNoshow"
                            color="primary"
                            value="percent"
                            checked={feeTypeForNoshow === "percent"}
                            onChange={(e) =>
                              setFeeTypeForNoshow(e.target.value)
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
                          label="Fixed No-show fee"
                          type="number"
                          variant="outlined"
                          name="noshowFeeValueFixed"
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
            title="Upload setup"
            icon={<Settings />}
            isFullWidth={false}
          />
        </Stack>
      </Stack>
    </form>
  );
};

export default SetUp;
