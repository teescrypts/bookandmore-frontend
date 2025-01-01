import {
  Stack,
  Card,
  CardHeader,
  CardContent,
  FormControl,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  Grid2,
  Button,
} from "@mui/material";
import React from "react";

const permissions = [
  {
    label: "Tax",
    value: "tax",
  },
  {
    label: "Customers",
    value: "customers",
  },
  {
    label: "Rent",
    value: "rent",
  },
  {
    label: "Staffs",
    value: "staffs",
  },
  {
    label: "POS",
    value: "pos",
  },
  {
    label: "Orders",
    value: "orders",
  },
  {
    label: "Products",
    value: "products",
  },
  {
    label: "Shipping",
    value: "shipping",
  },
  {
    label: "Blog",
    value: "blog",
  },
  {
    label: "Marketting",
    value: "marketting",
  },
];

function RegularEditForm() {
  return (
    <form>
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
                label="last Name"
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

              <TextField
                name="position"
                label="Position"
                type="text"
                required
                variant="outlined"
              />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Permissions" />
          <CardContent>
            <Grid2 container spacing={2}>
              {permissions.map((permission, index) => {
                return (
                  <Grid2 key={index} size={{ xs: 6, md: 4 }}>
                    <FormControlLabel
                      control={<Checkbox name={permission.value} />}
                      label={permission.label}
                    />
                  </Grid2>
                );
              })}
            </Grid2>
          </CardContent>
        </Card>

        <Stack direction={"row"} justifyContent={"flex-end"}>
          <Button variant="contained">Create Form</Button>
        </Stack>
      </Stack>
    </form>
  );
}

export default RegularEditForm;
