"use client";

import { uploadTaxRegistration } from "@/app/actions/actions";
import { SubmitButton } from "@/components/submit-button";
import notify from "@/utils/toast";
import {
  Stack,
  Typography,
  Grid2,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Country, IState, State } from "country-state-city";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";

const initialValue: { error?: string } | null = null;

function TaxRegistrations() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>("");
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<IState[]>([]);

  const [state, formAction] = useFormState(uploadTaxRegistration, initialValue);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      // if (state?.success) notify("Registration Uploaded Successfully");
    }
  }, [state]);

  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry));
    } else {
      setStates([]);
    }
  }, [selectedCountry, selectedState]);

  return (
    <form action={formAction}>
      <Stack>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Registrations
        </Typography>

        <Typography variant="body2" color="textSecondary">
          You Can Upload More Than One Registrations
        </Typography>

        <Typography variant="body2" color="error">
          {message}
        </Typography>

        {/* Registration Form */}
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Autocomplete
              options={countries}
              getOptionLabel={(option) => option.name}
              value={
                countries.find(
                  (country) => country.isoCode === selectedCountry
                ) || null
              }
              onChange={(event, newValue) => {
                if (newValue?.isoCode !== "US") {
                  alert(
                    "This demo supports the US only. Customization available for other countries."
                  );
                  return;
                }
                setSelectedCountry(newValue ? newValue.isoCode : null);
                setSelectedState(null);
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

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Autocomplete
              options={states}
              getOptionLabel={(option) => option.name}
              value={
                states.find((state) => state.isoCode === selectedState) || null
              }
              onChange={(event, newValue) => {
                setSelectedState(newValue ? newValue.isoCode : null);
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

          <Grid2 size={{ xs: 12, md: 12 }}>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              name="activeFrom"
              label="Active From"
              helperText="Leave date empty if you want to start collecting tax immediately"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid2>
        </Grid2>

        <Stack direction={"row"} justifyContent={"flex-start"} sx={{ mt: 2 }}>
          <SubmitButton title={"Add Registration"} isFullWidth={false} />
        </Stack>
      </Stack>
    </form>
  );
}

export default TaxRegistrations;
