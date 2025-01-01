"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import EmptyState from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { adminPaths } from "@/paths";
import { LoyaltyPointsSettingTypes } from "../../../marketing/loyalty-points/page";
import { ProductsAndServiceType } from "../../../marketing/loyalty-points/add/page";
import { SubmitButton } from "@/components/submit-button";
import Settings from "@/icons/untitled-ui/duocolor/settings";
import {
  updateLoyaltyPointActive,
  updateLoyaltyPointSettings,
} from "@/app/actions/actions";
import { useFormState } from "react-dom";
import notify from "@/utils/toast";

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

type PropTypes = {
  settings: LoyaltyPointsSettingTypes | false;
  services: ProductsAndServiceType[];
  products: ProductsAndServiceType[];
  existingProducts?: ProductsAndServiceType[];
  existingServices?: ProductsAndServiceType[];
};

const initialState: { error?: string; success?: string } | null = null;

const LoyaltyPointSettings: React.FC<PropTypes> = ({
  settings,
  products,
  services,
  existingProducts,
  existingServices,
}) => {
  const router = useRouter();

  if (!settings) {
    return (
      <EmptyState
        message="No loyalty settings found"
        actionLabel="Set up Loyalty point settings"
        onActionClick={() =>
          router.push(`${adminPaths.dashboard.marketing.points}/add`)
        }
      />
    );
  }

  const [extProds, setExtProds] = useState<string[]>(
    existingProducts ? existingProducts.map((prod) => prod._id) : []
  );

  const [extServices, setExtServices] = useState<string[]>(
    existingServices ? existingServices.map((service) => service._id) : []
  );

  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    settings?.prodServiceIds
      ? settings.prodServiceIds.map((prod) => prod._id)
      : []
  );

  const [selectedServices, setSelectedServices] = useState<string[]>(
    settings?.aptServiceIds
      ? settings.aptServiceIds.map((service) => service._id)
      : []
  );

  const [enableReferral, setEnableReferral] = useState(settings.enableReferral);
  const [enableAppointMent, setEnableAppointment] = useState(
    settings.enableAppointment
  );
  const [enableProduct, setEnableProduct] = useState(settings.enableProduct);
  const [minimumAmountEnabledApt, setMinimumAmountEnabledApt] = useState(
    settings.minimumAmountEnabledApt
  );
  const [minimumAmountEnabledProd, setMinimumAmountEnabledProd] = useState(
    settings.minimumAmountEnabledProd
  );
  const [appliesToApt, setAppliesToApt] = useState(settings.appliesToApt);
  const [appliesToProd, setAppliesToProd] = useState(settings.appliesToProd);

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
  const [activeMsg, setActiveMsg] = useState("");
  const updateLoyaltyPointSettingsPlus = updateLoyaltyPointSettings.bind(
    null,
    selectedProducts,
    selectedServices,
    extProds,
    extServices
  );

  const [state, formAction] = useFormState(
    updateLoyaltyPointSettingsPlus,
    initialState
  );

  useEffect(() => {
    if (state?.error) setMessage(state.error);
    if (state?.success) notify(state.success);
  }, [state]);

  return (
    <Stack spacing={3}>
      <Stack sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="error">
          {activeMsg}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              onChange={async (e) => {
                const result = await updateLoyaltyPointActive(
                  settings._id,
                  e.target.checked
                );

                if (result?.error) setActiveMsg(result.error);
                if (result.success) notify(result.success);
              }}
              defaultChecked={settings.active}
            />
          }
          label={settings.active ? "Inactivate" : "Activate"}
        />
      </Stack>

      <form action={formAction}>
        <Card>
          <CardContent>
            {settings.active ? (
              <Stack>
                <Typography variant="h6">Loyalty Points Settings</Typography>
                <Divider sx={{ my: 2 }} />

                <Stack spacing={3} sx={{ mt: 2 }}>
                  <Box>
                    <input name="id" defaultValue={settings._id} hidden />
                    <Typography variant="h6">Point Value Equivalent</Typography>
                    <TextField
                      required
                      name="monetaryEquivalent"
                      variant="outlined"
                      type="number"
                      label="Monetary Equivalent of One Point"
                      fullWidth
                      defaultValue={settings.monetaryEquivalent}
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
                        defaultValue={settings.minimumReferral}
                        label="Number of Referrals Required to Earn Points"
                        fullWidth
                        sx={{ mt: 2 }}
                        helperText="Specify the number of successful referrals required to earn one loyalty point."
                      />
                    )}
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="h6">
                      Appointment Booking Points
                    </Typography>
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
                            defaultValue={settings.minimumAmountApt}
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
                                      .filter((item) =>
                                        selected.includes(item._id)
                                      )
                                      .map((item) => item.name)
                                      .join(", ")
                                  }
                                  MenuProps={MenuProps}
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
                                No services are currently available for this
                                branch.
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
                    <Typography variant="h6">
                      Product Purchase Points
                    </Typography>
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
                            defaultValue={settings.minimumAmountProd}
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
                                      .filter((item) =>
                                        selected.includes(item._id)
                                      )
                                      .map((item) => item.name)
                                      .join(", ")
                                  }
                                  MenuProps={MenuProps}
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
                                No products are currently available for this
                                branch.
                              </Typography>
                            )}
                          </div>
                        )}
                      </Stack>
                    )}
                  </Box>
                </Stack>
              </Stack>
            ) : (
              <Typography textAlign={"center"} variant="h6" color="info">
                Your Loyalty Points settings are currently inactive. <br />{" "}
                While existing points can still be redeemed, new points cannot
                be earned.
              </Typography>
            )}
          </CardContent>
        </Card>

        <Typography variant="subtitle2" color="error" textAlign={"center"}>
          {message}
        </Typography>

        {settings.active && (
          <Stack direction={"row"} justifyContent={"flex-end"}>
            <SubmitButton
              icon={<Settings />}
              title="Save settings"
              isFullWidth={false}
            />
          </Stack>
        )}
      </form>
    </Stack>
  );
};

export default LoyaltyPointSettings;
