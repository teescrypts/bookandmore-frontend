"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Stack,
  Typography,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Grid2,
  SelectChangeEvent,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { serviceTaxCodes } from "@/tax-codes/services";
import { SubmitButton } from "@/components/submit-button";
import { useFormState } from "react-dom";
import { addService } from "@/app/actions/actions";
import { useRouter } from "next/navigation";
import { StaffTypeForService } from "../../services/add/page";
import { adminPaths } from "@/paths";

const availableColors = [
  { label: "Blue", value: "#3f51b5" },
  { label: "Pink", value: "#ff4081" },
  { label: "Green", value: "#00e676" },
  { label: "Red", value: "#f44336" },
  { label: "Orange", value: "#ff9800" },
  { label: "Purple", value: "#9c27b0" },
  { label: "Yellow", value: "#ffeb3b" },
  { label: "Cyan", value: "#00bcd4" },
  { label: "Teal", value: "#009688" },
  { label: "Brown", value: "#795548" },
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

const initialState: { error?: string; success?: string } | null = null;

interface PropType {
  staffs: StaffTypeForService[];
}

const AddServiceForm: React.FC<PropType> = ({ staffs }) => {
  const serviceCategoryAndTax = serviceTaxCodes;
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const selectedId = event.target.value;
    const selectedItem = serviceTaxCodes.find((item) => item.id === selectedId);

    if (selectedItem) {
      setSelectedCategory(selectedId);
      setSelectedDescription(selectedItem.description);
      setSelectedName(selectedItem.name);
    }
  };

  const router = useRouter();

  const [message, setMessage] = useState("");
  const addServiceStaff = addService.bind(null, selectedStaff);
  const [state, formAction] = useFormState(addServiceStaff, initialState);

  useEffect(() => {
    if (state?.error) setMessage(state.error);

    if (state?.success) {
      router.push(adminPaths.dashboard.booking.services);
    }
  }, [state]);

  const handleAddStaff = (event: SelectChangeEvent<typeof selectedStaff>) => {
    const {
      target: { value },
    } = event;
    setSelectedStaff(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <form action={formAction}>
      <Stack spacing={4}>
        <Card>
          <CardContent>
            <Grid2 spacing={2} container>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="h6">Basic Details</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Stack spacing={2}>
                  <TextField
                    required
                    label="Service Name"
                    variant="outlined"
                    fullWidth
                    name="name"
                  />

                  <input
                    defaultValue={selectedName}
                    name="categoryName"
                    hidden
                  />

                  <FormControl fullWidth required>
                    <InputLabel id="service-category-select-label">
                      Category
                    </InputLabel>
                    <Select
                      required
                      label="Category"
                      labelId="service-category-select-label"
                      name="categoryTaxCode"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                    >
                      {serviceCategoryAndTax.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {selectedDescription && (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 2 }}
                      >
                        {selectedDescription}
                      </Typography>
                    )}
                  </FormControl>

                  <TextField
                    label="Service Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    name="description"
                  />

                  <FormControl fullWidth>
                    <InputLabel>Color</InputLabel>
                    <Select required name="color" label="Color">
                      {availableColors.map((color) => (
                        <MenuItem key={color.value} value={color.value}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Box
                              sx={{
                                width: 25,
                                height: 25,
                                backgroundColor: color.value,
                                borderRadius: "50%",
                              }}
                            />
                            <Typography>{color.label}</Typography>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Grid2 spacing={2} container>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="h6">Price</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Stack direction="column" spacing={2}>
                  <TextField
                    required
                    label="Price Amount ($)"
                    variant="outlined"
                    fullWidth
                    slotProps={{
                      input: { startAdornment: "$" },
                      htmlInput: { step: "any" },
                    }}
                    name="priceAmount"
                    type="number"
                  />
                </Stack>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Grid2 spacing={2} container>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="h6">Time</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Stack direction="column" spacing={2}>
                  <Typography variant="subtitle2">Estimated Time</Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Hours"
                      variant="outlined"
                      fullWidth
                      name="estimatedHours"
                      type="number"
                    />
                    <TextField
                      label="Minutes"
                      variant="outlined"
                      fullWidth
                      name="estimatedMinutes"
                      type="number"
                    />
                  </Stack>

                  {/* Buffer Time with Helper Text */}
                  <Typography variant="subtitle2">Buffer Time</Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Hours"
                      variant="outlined"
                      fullWidth
                      name="bufferHours"
                      type="number"
                      helperText="This is the time required before the next appointment."
                    />
                    <TextField
                      label="Minutes"
                      variant="outlined"
                      fullWidth
                      name="bufferMinutes"
                      type="number"
                    />
                  </Stack>
                </Stack>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Grid2 spacing={2} container>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="h6">Add Staffs</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Stack direction="column" spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="appliesToProd-id">Add staff</InputLabel>
                    <Select
                      labelId="appliesToProd-id"
                      id="appliesToProd"
                      multiple
                      value={selectedStaff}
                      onChange={handleAddStaff}
                      input={<OutlinedInput label="Add staff" />}
                      renderValue={(selected) =>
                        staffs
                          .filter((item) => selected.includes(item._id))
                          .map((item) => `${item.fname} ${item.lname}`)
                          .join(", ")
                      }
                      MenuProps={MenuProps}
                      required
                    >
                      {staffs.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          <Checkbox
                            checked={selectedStaff.includes(item._id)}
                          />
                          <ListItemText
                            primary={`${item.fname} ${item.lname}`}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        <Typography color="error" textAlign={"center"} variant="subtitle2">
          {message}
        </Typography>

        <Stack direction="row" justifyContent="flex-end">
          <SubmitButton title="Add service" isFullWidth={false} />
        </Stack>
      </Stack>
    </form>
  );
};

export default AddServiceForm;
