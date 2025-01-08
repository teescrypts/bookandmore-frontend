"use client";

import { addCommissionStaffForm } from "@/app/actions/actions";
import { SubmitButton } from "@/components/submit-button";
import {
  Stack,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Grid2,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ServiceForFormType } from "../../staffs/add/page";
import { staffPaths } from "@/paths";

const permissions = [
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

const initialState: { error?: string; success?: string } | null = {};

function CommissionForm({ services }: { services: ServiceForFormType[] }) {
  const [allocatedServices, setAllocatedServices] = useState<string[]>([]);

  const addCommisionFormWithService = addCommissionStaffForm.bind(
    null,
    allocatedServices
  );

  const [state, formAction] = useFormState(
    addCommisionFormWithService,
    initialState
  );
  const [message, setMessage] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.success) {
        setRedirecting(true);
        router.push(
          `${staffPaths.dashboard.staff.pendingForms}?from={{staff-form}}`
        );
      }
    }
  }, [state]);

  const handleAllocateService = (
    event: SelectChangeEvent<typeof allocatedServices>
  ) => {
    const {
      target: { value },
    } = event;
    setAllocatedServices(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <form action={formAction}>
      <Stack spacing={2}>
        <Card>
          <CardHeader title="Staff Details" />
          <CardContent>
            <Stack spacing={2}>
              <TextField
                name="fname"
                label="First Name"
                type="text"
                required
                variant="outlined"
              />

              <TextField
                name="lname"
                label="Last Name"
                type="text"
                required
                variant="outlined"
              />

              <TextField
                name="email"
                label="Email"
                type="email"
                required
                variant="outlined"
              />

              <Stack>
                <Typography color="textSecondary" variant="subtitle2">
                  Date Of Birth
                </Typography>
                <TextField name="dob" type="date" required variant="outlined" />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Commission" />
          <CardContent>
            <TextField
              fullWidth
              name="commission"
              variant="outlined"
              label="Commission Rate %"
              type="number"
              slotProps={{
                htmlInput: { step: "any" },
              }}
              helperText="Percentage paid to staff as commission"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Services and Opening Hours" />
          <CardContent>
            <FormControl fullWidth>
              <InputLabel id="appliesToProd-id">
                Allocate Services To Staff
              </InputLabel>
              <Select
                labelId="appliesToProd-id"
                id="appliesToProd"
                multiple
                value={allocatedServices}
                onChange={handleAllocateService}
                input={<OutlinedInput label=" Allocate Services To Staff" />}
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
                    <Checkbox checked={allocatedServices.includes(item._id)} />
                    <ListItemText primary={item.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Permissions" />
          <CardContent>
            <Grid2 container spacing={2}>
              {permissions.map((permission, index) => (
                <Grid2 key={index} size={{ xs: 6, md: 4 }}>
                  <FormControlLabel
                    control={<Checkbox name={permission.name} />}
                    label={permission.label}
                  />
                </Grid2>
              ))}
            </Grid2>
          </CardContent>
        </Card>

        <Typography color="error" variant="subtitle2">
          {message}
        </Typography>

        {redirecting && (
          <Stack justifyContent={"center"} direction={"row"}>
            <CircularProgress />
          </Stack>
        )}

        <Stack direction={"row"} justifyContent={"flex-end"}>
          <SubmitButton title="Add Form" isFullWidth={false} />
        </Stack>
      </Stack>
    </form>
  );
}

export default CommissionForm;
