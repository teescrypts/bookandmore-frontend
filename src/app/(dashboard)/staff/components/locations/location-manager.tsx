"use client";

import { Fragment, useState } from "react";
import {
  Button,
  Typography,
  IconButton,
  Switch,
  Stack,
  Tooltip,
  Grid2,
  Card,
  CardContent,
} from "@mui/material";
import Add from "@/icons/untitled-ui/duocolor/add";
import Edit from "@/icons/untitled-ui/duocolor/edit";
import EmptyState from "@/components/empty-state";
import Link from "next/link";
import { staffPaths } from "@/paths";
import LocationDialog from "./add-location";
import EventBusy from "@/icons/untitled-ui/duocolor/event-busy";
import EventAvailable from "@/icons/untitled-ui/duocolor/event-available";
import { updateLocation } from "@/app/actions/actions";
import { useUserData } from "@/app/authentication/dashboard/auth-context";
import notify from "@/utils/toast";

interface Address {
  line1: string;
  line2: string;
  country: {
    countryName: string;
    countryCode: string;
  };
  state: {
    stateName: string;
    stateCode: string;
  };
  city: {
    cityName: string;
    cityCode: string;
  };
  postalCode: string;
}

type Location = {
  _id: string;
  name: string;
  address: Address;
  opened: boolean;
  active: boolean;
};

const LocationManager = ({
  branches,
}: {
  branches: Location[] | undefined;
}) => {
  const [open, setOpen] = useState(false);
  const handleOpenForm = () => setOpen(true);
  const handleCloseForm = () => setOpen(false);
  const [message, setMessage] = useState("");

  const { getUserData, userType } = useUserData();

  return (
    <>
      <Card>
        <CardContent>
          <Stack direction={"row"} justifyContent={"right"}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenForm()}
              sx={{ mb: 2 }}
            >
              Add Location
            </Button>
          </Stack>

          {branches && branches.length > 0 ? (
            <Grid2 container spacing={4} sx={{ mt: 2 }}>
              <Grid2 size={{ xs: 12 }}>
                <Typography
                  color="error"
                  textAlign={"center"}
                  variant="subtitle2"
                >
                  {message}
                </Typography>
              </Grid2>

              {branches.map((branch) => {
                return (
                  <Fragment key={branch._id}>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <Typography variant="h6">{branch.name}</Typography>
                      <Typography variant="subtitle1">{`${branch.address.line1}, ${branch.address.city.cityName}, ${branch.address.state.stateName}, ${branch.address.country.countryName} - ${branch.address.postalCode}`}</Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <Stack
                        justifyContent={"flex-end"}
                        spacing={4}
                        direction={"row"}
                      >
                        {userType === "admin" && (
                          <Switch
                            checked={branch.active}
                            onChange={async (e) => {
                              const result = await updateLocation(
                                e.target.name,
                                e.target.checked,
                                branch._id
                              );

                              if (result?.error) setMessage(result.error);
                              if (result?.success) {
                                getUserData();
                                notify(result.success);
                              }
                            }}
                            color="primary"
                            name="active"
                          />
                        )}
                        <Link
                          href={`${staffPaths.dashboard.location}/${branch._id}`}
                        >
                          <IconButton>
                            <Edit />
                          </IconButton>
                        </Link>

                        {branch.opened ? (
                          <Tooltip title="Close branch">
                            <IconButton
                              onClick={async (e) => {
                                const result = await updateLocation(
                                  "opened",
                                  false,
                                  branch._id
                                );
                                if (result?.error) setMessage(result.error);
                                if (result?.success) notify(result.success);
                              }}
                              color="error"
                            >
                              <EventBusy />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Open branch">
                            <IconButton
                              onClick={async (e) => {
                                const result = await updateLocation(
                                  "opened",
                                  true,
                                  branch._id
                                );

                                if (result?.error) setMessage(result.error);
                                if (result?.success) notify(result.success);
                              }}
                              color="success"
                            >
                              <EventAvailable />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </Grid2>
                  </Fragment>
                );
              })}
            </Grid2>
          ) : (
            <EmptyState
              message="No location found"
              actionLabel="Add Location"
              onActionClick={() => handleOpenForm()}
            />
          )}
        </CardContent>
      </Card>

      <LocationDialog open={open} handleCloseForm={handleCloseForm} />
    </>
  );
};

export default LocationManager;
