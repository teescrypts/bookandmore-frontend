"use client";

import { addAllowedCountry, deleteAllowedCountry } from "@/app/actions/actions";
import { SubmitButton } from "@/components/submit-button";
import notify from "@/utils/toast";
import {
  Typography,
  Divider,
  Grid2,
  Autocomplete,
  TextField,
  Button,
  Stack,
  Box,
} from "@mui/material";
import { Country } from "country-state-city";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { AllowedCountryType } from "../../shipping/page";
import Delete from "@/icons/untitled-ui/duocolor/delete";

const initialValue: { error?: string; success?: string } | null = null;

function AllowedCountry({
  allowedCountries,
}: {
  allowedCountries: AllowedCountryType[];
}) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>("");
  const [countries] = useState(Country.getAllCountries());

  const [message, setMessaage] = useState("");
  const [state, formAction] = useFormState(addAllowedCountry, initialValue);

  useEffect(() => {
    if (state) {
      if (state?.error) setMessaage(state.error);
      if (state?.success) {
        notify(state.success);
      }
    }
  }, [state]);

  return (
    <form action={formAction}>
      <Typography variant="h6" sx={{ mt: 4 }}>
        Allowed Countries
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Grid2 container spacing={2} sx={{ mt: 2 }}>
        <Typography color="error" variant="subtitle2">
          {message}
        </Typography>

        {allowedCountries.length > 0 ? (
          <Box sx={{ width: "100%" }}>
            {allowedCountries.map((allowedCountry) => (
              <Stack
                key={allowedCountry._id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  background: "rgba(0,0,0,0.05)",
                  p: 2,
                  mb: 2,
                  borderRadius: 1,
                }}
              >
                <Typography>
                  {allowedCountry.country.name} -{" "}
                  {allowedCountry.country.isoCode}
                </Typography>
                <Stack direction={"row"} spacing={2}>
                  <Button
                    variant="text"
                    color="error"
                    startIcon={<Delete />}
                    onClick={async () => {
                      const result = await deleteAllowedCountry(
                        allowedCountry._id
                      );

                      if (result?.error) setMessaage(result.error);
                      if (result?.success) notify(result.success);
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            ))}
          </Box>
        ) : (
          <Typography>
            No Country added. Shipping will be allowed for all Countries
          </Typography>
        )}

        <Autocomplete
          fullWidth
          options={countries}
          getOptionLabel={(option) => option.name}
          value={
            countries.find((country) => country.isoCode === selectedCountry) ||
            null
          }
          onChange={(event, newValue) => {
            setSelectedCountry(newValue ? newValue.isoCode : null);
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

        <SubmitButton title="Add allowed country" isFullWidth={false} />
      </Grid2>
    </form>
  );
}

export default AllowedCountry;
