"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Card,
  CardContent,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Grid2,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Add from "@/icons/untitled-ui/duocolor/add";
import Delete from "@/icons/untitled-ui/duocolor/delete";
import Edit from "@/icons/untitled-ui/duocolor/edit";

interface Service {
  name: string;
  price: number;
}

interface ComboService {
  name: string;
  services: Service[];
}

const availableServices: Service[] = [
  { name: "Haircut", price: 25 },
  { name: "Manicure", price: 15 },
  { name: "Facial", price: 30 },
  { name: "Massage", price: 50 },
];

const ComboServiceForm: React.FC = () => {
  const [comboServices, setComboServices] = useState<ComboService[]>([]);
  const [newCombo, setNewCombo] = useState<ComboService>({
    name: "",
    services: [],
  });
  const [selectedService, setSelectedService] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleAddComboService = () => {
    if (newCombo.name && newCombo.services.length > 0) {
      setComboServices([...comboServices, newCombo]);
      setNewCombo({ name: "", services: [] });
    }
  };

  const handleDeleteComboService = (index: number) => {
    const updatedCombos = [...comboServices];
    updatedCombos.splice(index, 1);
    setComboServices(updatedCombos);
  };

  const handleEditComboService = (index: number) => {
    setNewCombo(comboServices[index]);
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const updatedCombos = [...comboServices];
      updatedCombos[editingIndex] = newCombo;
      setComboServices(updatedCombos);
      setEditingIndex(null);
    }
    setIsDialogOpen(false);
    setNewCombo({ name: "", services: [] });
  };

  const handleAddServiceToCombo = () => {
    const selectedServiceObj = availableServices.find(
      (service) => service.name === selectedService
    );
    if (selectedServiceObj) {
      setNewCombo({
        ...newCombo,
        services: [...newCombo.services, selectedServiceObj],
      });
      setSelectedService("");
    }
  };

  const handleRemoveServiceFromCombo = (serviceIndex: number) => {
    const updatedServices = [...newCombo.services];
    updatedServices.splice(serviceIndex, 1);
    setNewCombo({ ...newCombo, services: updatedServices });
  };

  return (
    <Stack spacing={4}>
      <Card>
        <CardContent>
          <Typography variant="h6">Add Combo Service</Typography>
          <Stack direction="row" spacing={2} mt={2} alignItems="center">
            <TextField
              label="Combo Name"
              variant="outlined"
              fullWidth
              value={newCombo.name}
              onChange={(e) =>
                setNewCombo({ ...newCombo, name: e.target.value })
              }
            />
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setIsDialogOpen(true)}
              sx={{ height: "56px" }} // Set the height manually to match TextField
            >
              Add Services
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Combo Services List */}
      {comboServices.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6">Combo Services</Typography>
            <Grid2 container spacing={2} mt={2}>
              {comboServices.map((combo, index) => (
                <Grid2 size={{ xs: 12, md: 6 }} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1">{combo.name}</Typography>
                      <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                        {combo.services.map((service, serviceIndex) => (
                          <Chip
                            key={serviceIndex}
                            label={`${service.name} ($${service.price})`}
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                      <Stack direction="row" spacing={1} mt={2}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditComboService(index)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteComboService(index)}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid2>
              ))}
            </Grid2>
          </CardContent>
        </Card>
      )}

      {/* Dialog for Adding Services to Combo */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingIndex !== null ? "Edit Combo" : "Add Combo"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Combo Name"
              variant="outlined"
              fullWidth
              value={newCombo.name}
              onChange={(e) =>
                setNewCombo({ ...newCombo, name: e.target.value })
              }
            />

            <FormControl fullWidth>
              <InputLabel>Select Service</InputLabel>
              <Select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                label="Select Service"
              >
                {availableServices.map((service) => (
                  <MenuItem key={service.name} value={service.name}>
                    {`${service.name} ($${service.price})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="outlined" onClick={handleAddServiceToCombo}>
              Add to Combo
            </Button>

            {/* List of selected services */}
            {newCombo.services.length > 0 && (
              <Box>
                <Typography variant="subtitle2" mb={1}>
                  Selected Services:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {newCombo.services.map((service, index) => (
                    <Chip
                      key={index}
                      label={`${service.name} ($${service.price})`}
                      onDelete={() => handleRemoveServiceFromCombo(index)}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={
              editingIndex !== null ? handleSaveEdit : handleAddComboService
            }
          >
            {editingIndex !== null ? "Save Changes" : "Add Combo"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ComboServiceForm;
