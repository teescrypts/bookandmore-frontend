"use client";

import { SubmitButton } from "@/components/submit-button";
import {
  Stack,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ProductsAndServiceType } from "../../../marketing/loyalty-points/add/page";
import EmptyState from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { adminPaths } from "@/paths";
import { addLoyaltyPointSettings } from "@/app/actions/actions";
import { useFormState } from "react-dom";
import Settings from "@/icons/untitled-ui/duocolor/settings";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const initialState: { error?: string; success?: string } | null = null;

function LoyaltyPointSetup({
  products,
  services,
}: {
  services: ProductsAndServiceType[];
  products: ProductsAndServiceType[];
}) {
  if (products.length === 0 && services.length === 0) {
    return (
      <EmptyState
        message="You have not add any product/service."
        actionLabel="Go to services"
        onActionClick={() => router.push(adminPaths.dashboard.booking.services)}
      />
    );
  }

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [enableReferral, setEnableReferral] = useState(false);
  const [enableAppointMent, setEnableAppointment] = useState(false);
  const [enableProduct, setEnableProduct] = useState(false);
  const [minimumAmountEnabledApt, setMinimumAmountEnabledApt] = useState(false);
  const [minimumAmountEnabledProd, setMinimumAmountEnabledProd] =
    useState(false);
  const [appliesToApt, setAppliesToApt] = useState(false);
  const [appliesToProd, setAppliesToProd] = useState(false);
  const router = useRouter();

  const handleProductAdd = (
    event: SelectChangeEvent<typeof selectedProducts>
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedProducts(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleServiceAdd = (
    event: SelectChangeEvent<typeof selectedServices>
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedServices(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const [message, setMessage] = useState("");
  const addLoyaltyPointSettingsPlus = addLoyaltyPointSettings.bind(
    null,
    selectedProducts,
    selectedServices
  );

  const [state, formAction] = useFormState(
    addLoyaltyPointSettingsPlus,
    initialState
  );

  useEffect(() => {
    if (state?.error) setMessage(state.error);
    if (state?.success) router.push(adminPaths.dashboard.marketing.points);
  }, [state]);

  return (
    <form action={formAction}>
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Loyalty Points Settings</Typography>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={3} sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="error">
                {message}
              </Typography>
              <Box>
                <Typography variant="h6">Point Value Equivalent</Typography>
                <TextField
                  required
                  name="monetaryEquivalent"
                  variant="outlined"
                  type="number"
                  label="Monetary Equivalent of One Point"
                  fullWidth
                  sx={{ mt: 2 }}
                  slotProps={{ input: { startAdornment: "$ " } }}
                />
              </Box>

              <Box>
                <Typography variant="h6">Referral Points</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="enableReferral"
                      checked={enableReferral}
                      onChange={(e) => setEnableReferral(e.target.checked)}
                    />
                  }
                  label="Enable Earning Points for Referrals"
                  sx={{ mt: 2 }}
                />
                {enableReferral && (
                  <TextField
                    variant="outlined"
                    type="number"
                    name="minimumReferral"
                    required
                    label="Number of Referrals Required to Earn Points"
                    fullWidth
                    sx={{ mt: 2 }}
                    helperText="Specify the number of successful referrals required to earn one loyalty point."
                  />
                )}
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6">Appointment Booking Points</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="enableAppointment"
                      checked={enableAppointMent}
                      onChange={(e) => {
                        setEnableAppointment(e.target.checked);

                        if (!e.target.checked) {
                          setSelectedServices([]);
                        }
                      }}
                    />
                  }
                  label="Enable Earning Points for Appointment Bookings"
                  sx={{ mt: 2 }}
                />
                {enableAppointMent && (
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                      Requirements (optional)
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="minimumAmountEnabledApt"
                          checked={minimumAmountEnabledApt}
                          onChange={(e) =>
                            setMinimumAmountEnabledApt(e.target.checked)
                          }
                        />
                      }
                      label="Set Minimum Amount Required"
                    />
                    {minimumAmountEnabledApt && (
                      <TextField
                        variant="outlined"
                        type="number"
                        name="minimumAmountApt"
                        required
                        label="Minimum Amount Spent for Points"
                        fullWidth
                        helperText="Minimum amount that must be spent in an appointment to earn points."
                      />
                    )}
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="appliesToApt"
                          checked={appliesToApt}
                          onChange={(e) => {
                            setAppliesToApt(e.target.checked);

                            if (!e.target.checked) {
                              setSelectedServices([]);
                            }
                          }}
                        />
                      }
                      label="Limit to Specific Services Only"
                    />
                    {appliesToApt && (
                      <div>
                        {services.length > 0 ? (
                          <FormControl fullWidth>
                            <InputLabel id="applies-to-id-apt">
                              Apply to specified services
                            </InputLabel>
                            <Select
                              labelId="applies-to-id-apt"
                              id="appliesIdApt"
                              multiple
                              value={selectedServices}
                              onChange={handleServiceAdd}
                              input={
                                <OutlinedInput label="Apply to specified services" />
                              }
                              renderValue={(selected) =>
                                services
                                  .filter((item) => selected.includes(item._id))
                                  .map((item) => item.name)
                                  .join(", ")
                              }
                              MenuProps={MenuProps}
                              required
                            >
                              {services.map((item) => (
                                <MenuItem key={item._id} value={item._id}>
                                  <Checkbox
                                    checked={selectedServices.includes(
                                      item._id
                                    )}
                                  />
                                  <ListItemText primary={item.name} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <Typography variant="subtitle2" color="info">
                            No service has been added
                          </Typography>
                        )}
                      </div>
                    )}
                  </Stack>
                )}
              </Box>

              <Divider />

              {/* Product Purchase Points Settings */}
              <Box>
                <Typography variant="h6">Product Purchase Points</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="enableProduct"
                      checked={enableProduct}
                      onChange={(e) => {
                        setEnableProduct(e.target.checked);

                        if (!e.target.checked) {
                          setSelectedProducts([]);
                        }
                      }}
                    />
                  }
                  label="Enable Earning Points for Product Purchases"
                  sx={{ mt: 2 }}
                />
                {enableProduct && (
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                      Requirements (optional)
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="minimumAmountEnabledProd"
                          checked={minimumAmountEnabledProd}
                          onChange={(e) =>
                            setMinimumAmountEnabledProd(e.target.checked)
                          }
                        />
                      }
                      label="Set Minimum Amount Required"
                    />
                    {minimumAmountEnabledProd && (
                      <TextField
                        variant="outlined"
                        type="number"
                        name="minimumAmountProd"
                        required
                        label="Minimum Amount Spent for Points"
                        fullWidth
                        helperText="Minimum amount that must be spent in an appointment to earn points."
                      />
                    )}
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="appliesToProd"
                          checked={appliesToProd}
                          onChange={(e) => {
                            setAppliesToProd(e.target.checked);

                            if (!e.target.checked) {
                              setSelectedProducts([]);
                            }
                          }}
                        />
                      }
                      label="Limit to Specific Products Only"
                    />
                    {appliesToProd && (
                      <div>
                        {products.length > 0 ? (
                          <FormControl fullWidth>
                            <InputLabel id="appliesToProd-id">
                              Apply to specified products
                            </InputLabel>
                            <Select
                              labelId="appliesToProd-id"
                              id="appliesToProd"
                              multiple
                              value={selectedProducts}
                              onChange={handleProductAdd}
                              input={
                                <OutlinedInput label=" Apply to specified products" />
                              }
                              renderValue={(selected) =>
                                products
                                  .filter((item) => selected.includes(item._id))
                                  .map((item) => item.name)
                                  .join(", ")
                              }
                              MenuProps={MenuProps}
                              required
                            >
                              {products.map((item) => (
                                <MenuItem key={item._id} value={item._id}>
                                  <Checkbox
                                    checked={selectedProducts.includes(
                                      item._id
                                    )}
                                  />
                                  <ListItemText primary={item.name} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <Typography variant="subtitle2" color="info">
                            No Product has been added
                          </Typography>
                        )}
                      </div>
                    )}
                  </Stack>
                )}
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Stack direction={"row"} justifyContent={"flex-end"}>
          <SubmitButton
            icon={<Settings />}
            title="Add settings"
            isFullWidth={false}
          />
        </Stack>
      </Stack>
    </form>
  );
}

export default LoyaltyPointSetup;
