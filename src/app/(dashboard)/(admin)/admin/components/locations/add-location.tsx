"use client";

import React, { useEffect, useState } from "react";
import { Country, State, City, IState, ICity } from "country-state-city";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Grid2,
  Typography,
} from "@mui/material";
import { useFormState } from "react-dom";
import { addLocation } from "@/app/actions/actions";
import { SubmitButton } from "@/components/submit-button";
import notify from "@/utils/toast";

interface LocationDialogProps {
  open: boolean;
  editingLocation?: boolean;
  handleCloseForm: () => void;
}

const initialValue: { error?: string; success?: string } = {};

const LocationDialog: React.FC<LocationDialogProps> = ({
  open,
  editingLocation,
  handleCloseForm,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const [state, formAction] = useFormState(addLocation, initialValue);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry));
    } else {
      setStates([]);
    }

    if (selectedCountry && selectedState) {
      setCities(City.getCitiesOfState(selectedCountry, selectedState));
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState]);

  useEffect(() => {
    if (state.error) setMessage(state.error);
    if (state.success) {
      notify("Branch Added successfully");
      handleCloseForm();
      setSelectedCity(null);
      setSelectedCity(null);
      setSelectedState(null);
    }
  }, [state]);

  return (
    <Dialog open={open} onClose={handleCloseForm} fullWidth maxWidth="sm">
      <DialogTitle>
        {editingLocation ? "Edit Location" : "Add Location"}
      </DialogTitle>
      <form action={formAction}>
        <DialogContent>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <Typography
                variant="subtitle2"
                color="error"
                textAlign={"center"}
              >
                {message}
              </Typography>
              <TextField
                required
                variant="outlined"
                name="name"
                label="Location Name"
                fullWidth
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                required
                variant="outlined"
                name="line1"
                label="Address Line 1"
                fullWidth
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                variant="outlined"
                name="line2"
                label="Address Line 2"
                fullWidth
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                variant="outlined"
                name="timeZone"
                label="Time zone"
                helperText="Kindly search for IANA time zone identifier for your city"
                fullWidth
              />
            </Grid2>

            {/* Country Autocomplete */}
            <Grid2 size={{ xs: 6 }}>
              <Autocomplete
                options={countries}
                getOptionLabel={(option) => option.name}
                value={
                  countries.find(
                    (country) => country.isoCode === selectedCountry
                  ) || null
                }
                onChange={(event, newValue) => {
                  setSelectedCountry(newValue ? newValue.isoCode : null);
                  setSelectedState(null);
                  setSelectedCity(null);
                }}
                renderInput={(params) => (
                  <>
                    <TextField
                      required
                      {...params}
                      label="Country"
                      name="countryName"
                      variant="outlined"
                      fullWidth
                    />
                    <input
                      type="hidden"
                      name="countryCode"
                      value={selectedCountry || ""}
                    />
                  </>
                )}
              />
            </Grid2>

            {/* State Autocomplete */}
            <Grid2 size={{ xs: 6 }}>
              <Autocomplete
                options={states}
                getOptionLabel={(option) => option.name}
                value={
                  states.find((state) => state.isoCode === selectedState) ||
                  null
                }
                onChange={(event, newValue) => {
                  setSelectedState(newValue ? newValue.isoCode : null);
                  setSelectedCity(null);
                }}
                renderInput={(params) => (
                  <>
                    <TextField
                      required
                      {...params}
                      label="State"
                      name="stateName"
                      variant="outlined"
                      fullWidth
                    />
                    <input
                      type="hidden"
                      name="stateCode"
                      value={selectedState || ""}
                    />
                  </>
                )}
                disabled={!selectedCountry}
              />
            </Grid2>

            {/* City Autocomplete */}
            <Grid2 size={{ xs: 6 }}>
              <Autocomplete
                options={cities}
                getOptionLabel={(option) => option.name}
                value={
                  cities.find((city) => city.name === selectedCity) || null
                }
                onChange={(event, newValue) => {
                  setSelectedCity(newValue ? newValue.name : null);
                }}
                renderInput={(params) => (
                  <>
                    <TextField
                      {...params}
                      label="City"
                      name="cityName"
                      variant="outlined"
                      fullWidth
                    />
                    <input
                      type="hidden"
                      name="cityCode"
                      value={selectedCity || ""}
                    />
                  </>
                )}
                disabled={!selectedState}
              />
            </Grid2>

            <Grid2 size={{ xs: 6 }}>
              <TextField
                variant="outlined"
                name="postalCode"
                label="Postal Code"
                fullWidth
              />
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <SubmitButton title="Add Location" isFullWidth={false} />
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LocationDialog;
