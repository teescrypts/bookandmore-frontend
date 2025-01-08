"use client";

import { updateBranch } from "@/app/actions/actions";
import { SubmitButton } from "@/components/submit-button";
import notify from "@/utils/toast";
import {
  Autocomplete,
  Card,
  CardActions,
  CardContent,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import { Country, IState, ICity, City, State } from "country-state-city";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";

interface Address {
  line1: string;
  line2?: string;
  city: {
    cityName: string;
    cityCode: string;
  };
  country: {
    countryName: string;
    countryCode: string;
  };
  state: {
    stateName: string;
    stateCode: string;
  };
  postalCode?: string;
}

export interface BranchType {
  _id: string;
  name: string;
  address: Address;
  timeZone: string;
}

const initialState: { error?: string; success?: string } = {};

function EditLocation({ branch }: { branch: BranchType }) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(
    branch.address.country.countryCode
  );
  const [selectedState, setSelectedState] = useState<string | null>(
    branch.address.state.stateCode
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(
    branch.address.city.cityCode
  );

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

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

  const [state, formAction] = useFormState(updateBranch, initialState);
  const [message, setMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (state?.error) setMessage(state.error);
    if (state?.success) notify("Branch Updated");
  }, [state]);

  return (
    <Card>
      <form action={formAction}>
        <input type="hidden" name="id" value={branch._id} />
        <CardContent>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <Typography color="error" variant="subtitle2">
                {message}
              </Typography>
              <TextField
                required
                defaultValue={branch.name}
                variant="outlined"
                name="name"
                label="Location Name"
                fullWidth
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                required
                defaultValue={branch.address.line1}
                variant="outlined"
                name="line1"
                label="Address Line 1"
                fullWidth
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                variant="outlined"
                defaultValue={branch.address.line2 || ""}
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
                defaultValue={branch.timeZone || ""}
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
                defaultValue={branch.address.postalCode || ""}
                fullWidth
              />
            </Grid2>
          </Grid2>
        </CardContent>
        <CardActions>
          <SubmitButton title="Update Location" isFullWidth={false} />
        </CardActions>
      </form>
    </Card>
  );
}

export default EditLocation;
