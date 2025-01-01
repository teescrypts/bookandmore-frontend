"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Add from "@/icons/untitled-ui/duocolor/add";
import Delete from "@/icons/untitled-ui/duocolor/delete";

// Dummy data for services (these should come from your database)
const availableServices = [
  { id: 1, name: "Haircut" },
  { id: 2, name: "Beard Trim" },
  { id: 3, name: "Massage" },
  { id: 4, name: "Hair Color" },
];

const HomeServiceSettings: React.FC = () => {
  const [priceType, setPriceType] = useState("fixed");
  const [priceAmount, setPriceAmount] = useState("");
  const [isAnywhere] = useState(true);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleServiceSelection = (id: number) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(
        selectedServices.filter((serviceId) => serviceId !== id)
      );
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleSave = () => {
    // Handle save logic
    console.log({
      priceType,
      priceAmount,
      homeServiceLocations: isAnywhere ? "Anywhere" : "Specific locations",
      services: selectedServices,
    });
    setIsDialogOpen(false);
  };

  return (
    <Stack spacing={4}>
      {/* Price Section */}
      <Card>
        <CardContent>
          <Typography variant="h6">Home Service Pricing</Typography>
          <Stack direction="row" spacing={2} mt={2}>
            {/* Price Structure */}
            <Select
              fullWidth
              value={priceType}
              onChange={(e) => setPriceType(e.target.value)}
            >
              <MenuItem value="fixed">Fixed Price</MenuItem>
              <MenuItem value="starts_at">Starts At</MenuItem>
            </Select>

            {/* Price Amount */}
            <TextField
              label="Price Amount ($)"
              variant="outlined"
              type="number"
              fullWidth
              value={priceAmount}
              onChange={(e) => setPriceAmount(e.target.value)}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Service Section */}
      <Card>
        <CardHeader title="Services for Home Service" />
        <CardContent>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsDialogOpen(true)}
          >
            Add Services
          </Button>

          {/* List of Selected Services */}
          <Box mt={2}>
            <Divider />
            {selectedServices.length === 0 ? (
              <Typography>No services added for home service yet.</Typography>
            ) : (
              selectedServices.map((id) => {
                const service = availableServices.find((s) => s.id === id);
                return (
                  <Box
                    key={id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={2}
                  >
                    <Typography>{service?.name}</Typography>
                    <IconButton
                      color="error"
                      onClick={() => toggleServiceSelection(id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                );
              })
            )}
          </Box>
        </CardContent>
      </Card>

      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" color="primary">
          Save Settings
        </Button>
      </Stack>

      {/* Dialog for adding services */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Add Services for Home Service</DialogTitle>
        <DialogContent>
          {availableServices.map((service) => (
            <FormControlLabel
              key={service.id}
              control={
                <Checkbox
                  checked={selectedServices.includes(service.id)}
                  onChange={() => toggleServiceSelection(service.id)}
                />
              }
              label={service.name}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default HomeServiceSettings;
