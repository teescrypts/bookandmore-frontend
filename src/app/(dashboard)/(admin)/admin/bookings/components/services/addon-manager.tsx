"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import Delete from "@/icons/untitled-ui/duocolor/delete";
import Add from "@/icons/untitled-ui/duocolor/add";
import {
  deleteAddon,
  addAddon,
  fetchProductOrService,
} from "@/app/actions/actions";
import { AddonType } from "../../services/[id]/page";
import { SubmitButton } from "@/components/submit-button";
import { useFormState } from "react-dom";
import notify from "@/utils/toast";

interface propType {
  addons: AddonType[];
  serviceId: string;
}

const initialState: { error?: string; success?: string } | null = null;

const AddonManager: React.FC<propType> = ({ addons, serviceId }) => {
  const [type, setType] = useState<"product" | "service" | "">("");
  const [nameOptions, setNameOptions] = useState<
    { id: string; label: string }[]
  >([]);
  const [selectedAddonId, setSelectedAddonId] = useState<string | null>("");
  const [message, setMessage] = useState("");

  const [state, formAction] = useFormState(addAddon, initialState);

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state.success) notify(state.success);
    }
  }, [state]);

  useEffect(() => {
    const fetchData = async () => {
      if (type) {
        const result = await fetchProductOrService(type);

        if (result?.error) setMessage(result.error);

        if (result?.success) {
          const nameOptions = result.success.map((res) => {
            return { id: res._id, label: res.name };
          });

          setNameOptions(nameOptions);
        }
      } else {
        setNameOptions([]);
      }
    };

    fetchData();
  }, [type]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Addon Manager
        </Typography>

        {/* List of added addons */}
        <List>
          {addons.length > 0 ? (
            addons.map((addon, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${addon.addonService.name} (${addon.type})`}
                  secondary={addon.free ? "Free" : "Paid"}
                />

                <ListItemButton>
                  <IconButton
                    onClick={async () => {
                      const result = await deleteAddon(addon._id);

                      if (result?.error) setMessage(result.error);
                      if (result?.success) notify(result.success);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <Typography variant="subtitle2" color="info">
              No addon added yet
            </Typography>
          )}
        </List>

        <form action={formAction}>
          <Stack direction="column" spacing={2} mt={2}>
            <input defaultValue={serviceId} hidden name="serviceId" />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                required
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "product" | "service")
                }
                label="Type"
                name="type"
              >
                <MenuItem value="product">Product</MenuItem>
                <MenuItem value="service">Service</MenuItem>
              </Select>
            </FormControl>

            <Autocomplete
              disablePortal
              options={nameOptions}
              getOptionLabel={(option) => option.label}
              onChange={(event, value) =>
                setSelectedAddonId(value ? value.id : null)
              }
              renderInput={(params) => (
                <TextField
                  required
                  name={type}
                  {...params}
                  label="Name"
                  variant="outlined"
                  disabled={!type}
                />
              )}
            />
            <input
              hidden
              name="selectedAddon"
              defaultValue={selectedAddonId || ""}
            />

            <FormControlLabel
              control={<Checkbox name="free" />}
              label="Free Addon"
            />

            <Typography color="error" variant="subtitle1">
              {message}
            </Typography>

            <SubmitButton title="Add addon" isFullWidth={true} icon={<Add />} />
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddonManager;
