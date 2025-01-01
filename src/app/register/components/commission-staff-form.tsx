"use client";

import { SubmitButton } from "@/components/submit-button";
import convertToIso from "@/utils/convert-to-iso";
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  Grid2,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { StaffForm } from "../staff-onboarding-form/[id]/page";
import { useFormState } from "react-dom";
import { onboardCommissionStaff } from "@/app/actions/actions";

const permissions: { label: string; name: string }[] = [
  { label: "Locations", name: "locations" },
  { label: "Tax", name: "tax" },
  { label: "Customers", name: "customers" },
  { label: "Staffs", name: "staffs" },
  { label: "Services", name: "services" },
  { label: "Shop booking settings", name: "settings" },
  { label: "Rent", name: "rent" },
  { label: "Products", name: "products" },
  { label: "POS", name: "pos" },
  { label: "Orders", name: "orders" },
  { label: "Shipping", name: "shipping" },
  { label: "Blog", name: "blog" },
  { label: "Marketing", name: "marketing" },
];

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

const initialValue: { error?: string } | null = {};

function CommissionStaffForm({ staffForm }: { staffForm: StaffForm }) {
  const [allocatedServices, setAllocatedServices] = useState<string[]>(
    staffForm.services.map((service) => service._id)
  );

  const [message, setMessage] = useState("");
  const onBoardCommissionStaffWithAs = onboardCommissionStaff.bind(
    null,
    allocatedServices
  );
  const [state, formAction] = useFormState(
    onBoardCommissionStaffWithAs,
    initialValue
  );

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
    }
  }, [state]);

  return (
    <Box
      sx={{
        flex: "1 1 auto",
        minHeight: "100%",
        my: { xs: 4, md: 0 },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: {
            xs: "60px",
            md: "120px",
          },
          textAlign: "center",
        }}
      >
        <form action={formAction}>
          <Stack spacing={2}>
            <Typography variant="h5" mb={2}>
              Staff Onboarding Form
            </Typography>

            <input defaultValue={staffForm.admin} name="admin" hidden />
            <input defaultValue={staffForm.branch} name="branch" hidden />
            <input defaultValue={staffForm._id} name="formId" hidden />
            <input
              defaultValue={staffForm.commissionSettings!.commission}
              name="commission"
              hidden
            />

            {/* Preset Details */}
            <TextField
              fullWidth
              variant="outlined"
              defaultValue={staffForm.fname}
              name="fname"
              label="First Name"
              slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              variant="outlined"
              defaultValue={staffForm.lname}
              fullWidth
              name="lname"
              label="Last Name"
              slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              variant="outlined"
              fullWidth
              name="email"
              label="Email"
              defaultValue={staffForm.email}
              slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Category"
              name="category"
              defaultValue={staffForm.category}
              helperText={`${
                staffForm.commissionSettings!.commission
              }% commissions on appointments booked directly with you`}
              slotProps={{ input: { readOnly: true } }}
            />

            <TextField
              variant="outlined"
              fullWidth
              type="date"
              label="Date of birth"
              name="dob"
              defaultValue={convertToIso(
                staffForm.dob.day,
                staffForm.dob.month,
                staffForm.dob.year
              )}
              slotProps={{ input: { readOnly: true } }}
            />

            <>
              <InputLabel id="appliesToProd-id">Allocate Services</InputLabel>
              <Select
                labelId="appliesToProd-id"
                id="appliesToProd"
                multiple
                defaultValue={allocatedServices}
                input={<OutlinedInput label=" Allocate Services" />}
                renderValue={(selected) =>
                  staffForm.services
                    .filter((item) => selected.includes(item._id))
                    .map((item) => item.name)
                    .join(", ")
                }
                MenuProps={MenuProps}
                required
                readOnly
              >
                {staffForm.services.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    <Checkbox checked={allocatedServices.includes(item._id)} />
                    <ListItemText primary={item.name} />
                  </MenuItem>
                ))}
              </Select>
            </>

            <Box display="flex" alignItems="center" width="100%" mt={2} mb={2}>
              <Divider sx={{ flex: 1 }} />

              <Typography variant="subtitle1" sx={{ marginX: 2 }}>
                Permissions
              </Typography>

              <Divider sx={{ flex: 1 }} />
            </Box>
            <Grid2 container spacing={2}>
              {permissions.map((permission, index) => {
                return (
                  <Grid2
                    key={index}
                    size={{ xs: 6, md: 4 }}
                    sx={{
                      display: !staffForm.permissions[permission.name]
                        ? "none"
                        : "block",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          readOnly
                          checked={staffForm.permissions[permission.name]}
                          name={permission.name}
                        />
                      }
                      label={permission.label}
                    />
                  </Grid2>
                );
              })}
            </Grid2>

            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box
                display="flex"
                alignItems="center"
                width="100%"
                mt={2}
                mb={2}
              >
                <Divider sx={{ flex: 1 }} />

                <Typography variant="subtitle1" sx={{ marginX: 2 }}>
                  Create Password
                </Typography>

                <Divider sx={{ flex: 1 }} />
              </Box>
              <TextField
                variant="outlined"
                fullWidth
                defaultValue={""}
                name="password"
                label="Create Password"
                type="password"
                required
              />
              <TextField
                fullWidth
                variant="outlined"
                defaultValue={""}
                name="cPassword"
                label="Confirm Password"
                type="password"
                required
              />
            </Stack>

            <Box mt={3}>
              <FormControlLabel
                control={<Checkbox required name="confirmTermsAndInfo" />}
                label="I confirm the details are correct and I agree to the terms."
              />
            </Box>

            <Typography
              sx={{ my: 2 }}
              textAlign={"center"}
              color="error"
              variant="subtitle2"
            >
              {message}
            </Typography>

            <Stack sx={{ mt: 2 }}>
              <SubmitButton title="Start Onboarding" isFullWidth={true} />
            </Stack>
          </Stack>
        </form>
      </Container>
    </Box>
  );
}

export default CommissionStaffForm;
