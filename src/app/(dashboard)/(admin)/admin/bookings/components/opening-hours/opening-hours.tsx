"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControlLabel,
  FormLabel,
  Grid2,
  IconButton,
  Stack,
  SvgIcon,
  Switch,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import Add from "@/icons/untitled-ui/duocolor/add";
import ModalBox from "@/components/modal";
import { PropertyList } from "@/components/property-list";
import PropertyListItem from "@/components/property-list-item";
import AddOpeningHours from "./add-opening-hours";
import Copy from "@/icons/untitled-ui/duocolor/copy";
import { OpeningHoursType } from "../../opening-hours/page";
import { convertToAmPmFormat } from "@/utils/convert-to-am-pm";
import { deleteTimeSlot, updateAvailability } from "@/app/actions/actions";
import notify from "@/utils/toast";

function OpeningHours({ openingHours }: { openingHours: OpeningHoursType }) {
  const [message, setMessage] = useState("");
  const [updMsg, setUpdMsg] = useState("");

  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  const align = mdUp ? "horizontal" : "vertical";
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <div>
                <Typography variant="h4">Opening Hours</Typography>
              </div>
              <div>
                <Stack direction="row" spacing={4}>
                  <FormControlLabel
                    label="Available"
                    control={
                      <Switch
                        checked={
                          openingHours.availability === "available"
                            ? true
                            : false
                        }
                        onChange={async () => {
                          const result = await updateAvailability(
                            openingHours.availability === "available"
                              ? "unavailable"
                              : "available"
                          );

                          if (result?.error) setUpdMsg(result.error);
                          if (result?.success) notify(result.success);
                        }}
                      />
                    }
                  />
                  <Button
                    onClick={handleOpen}
                    startIcon={
                      <SvgIcon>
                        <Add />
                      </SvgIcon>
                    }
                    variant="contained"
                  >
                    ADD
                  </Button>
                </Stack>
              </div>
            </Stack>
            <Card>
              <CardContent>
                <Typography
                  color="error"
                  textAlign={"center"}
                  variant="subtitle2"
                >
                  {message}
                </Typography>
                <PropertyList>
                  <PropertyListItem align={align} label="MONDAY">
                    <Grid2 container spacing={2}>
                      {openingHours.monday.length > 0 ? (
                        openingHours.monday.map(
                          (
                            timeRanges: { from: string; to: string },
                            index: number
                          ) => {
                            return (
                              <Grid2
                                key={index}
                                size={{ xs: 12, sm: 12, md: 4 }}
                              >
                                <Chip
                                  label={`${convertToAmPmFormat(
                                    timeRanges.from
                                  )} - ${convertToAmPmFormat(timeRanges.to)}`}
                                  onDelete={async () => {
                                    const result = await deleteTimeSlot(
                                      "monday",
                                      {
                                        from: timeRanges.from,
                                        to: timeRanges.to,
                                      }
                                    );

                                    if (result?.error) setMessage(result.error);

                                    if (result?.success) notify(result.success);
                                  }}
                                />
                              </Grid2>
                            );
                          }
                        )
                      ) : (
                        <Typography color="text.secondary" variant="body2">
                          No Opening Hours
                        </Typography>
                      )}
                    </Grid2>
                  </PropertyListItem>
                  <Divider />
                  <PropertyListItem align={align} label="TUESDAY">
                    <Grid2 container rowSpacing={2} columnSpacing={1}>
                      {openingHours.tuesday.length > 0 ? (
                        openingHours.tuesday.map(
                          (
                            timeRanges: { from: string; to: string },
                            index: number
                          ) => {
                            return (
                              <Grid2
                                key={index}
                                size={{ xs: 12, sm: 12, md: 4 }}
                              >
                                <Chip
                                  label={`${convertToAmPmFormat(
                                    timeRanges.from
                                  )} - ${convertToAmPmFormat(timeRanges.to)}`}
                                  onDelete={async () => {
                                    const result = await deleteTimeSlot(
                                      "tuesday",
                                      {
                                        from: timeRanges.from,
                                        to: timeRanges.to,
                                      }
                                    );

                                    if (result?.error) setMessage(result.error);

                                    if (result?.success) notify(result.success);
                                  }}
                                />
                              </Grid2>
                            );
                          }
                        )
                      ) : (
                        <Typography color="text.secondary" variant="body2">
                          No Opening Hours
                        </Typography>
                      )}
                    </Grid2>
                  </PropertyListItem>
                  <Divider />
                  <PropertyListItem align={align} label="WEDNESDAY">
                    <Grid2 container rowSpacing={2} columnSpacing={1}>
                      {openingHours.wednesday.length > 0 ? (
                        openingHours.wednesday.map(
                          (
                            timeRanges: { from: string; to: string },
                            index: number
                          ) => {
                            return (
                              <Grid2
                                key={index}
                                size={{ xs: 12, sm: 12, md: 4 }}
                              >
                                <Chip
                                  label={`${convertToAmPmFormat(
                                    timeRanges.from
                                  )} - ${convertToAmPmFormat(timeRanges.to)}`}
                                  onDelete={async () => {
                                    const result = await deleteTimeSlot(
                                      "wednesday",
                                      {
                                        from: timeRanges.from,
                                        to: timeRanges.to,
                                      }
                                    );

                                    if (result?.error) setMessage(result.error);

                                    if (result?.success) notify(result.success);
                                  }}
                                />
                              </Grid2>
                            );
                          }
                        )
                      ) : (
                        <Typography color="text.secondary" variant="body2">
                          No Opening Hours
                        </Typography>
                      )}
                    </Grid2>
                  </PropertyListItem>
                  <Divider />
                  <PropertyListItem align={align} label="THURSDAY">
                    <Grid2 container rowSpacing={2} columnSpacing={1}>
                      {openingHours.thursday.length > 0 ? (
                        openingHours.thursday.map(
                          (
                            timeRanges: { from: string; to: string },
                            index: number
                          ) => {
                            return (
                              <Grid2
                                key={index}
                                size={{ xs: 12, sm: 12, md: 4 }}
                              >
                                <Chip
                                  label={`${convertToAmPmFormat(
                                    timeRanges.from
                                  )} - ${convertToAmPmFormat(timeRanges.to)}`}
                                  onDelete={async () => {
                                    const result = await deleteTimeSlot(
                                      "thursday",
                                      {
                                        from: timeRanges.from,
                                        to: timeRanges.to,
                                      }
                                    );

                                    if (result?.error) setMessage(result.error);

                                    if (result?.success) notify(result.success);
                                  }}
                                />
                              </Grid2>
                            );
                          }
                        )
                      ) : (
                        <Typography color="text.secondary" variant="body2">
                          No Opening Hours
                        </Typography>
                      )}
                    </Grid2>
                  </PropertyListItem>
                  <Divider />
                  <PropertyListItem align={align} label="FRIDAY">
                    <Grid2 container rowSpacing={2} columnSpacing={1}>
                      {openingHours.friday.length > 0 ? (
                        openingHours.friday.map(
                          (
                            timeRanges: { from: string; to: string },
                            index: number
                          ) => {
                            return (
                              <Grid2
                                key={index}
                                size={{ xs: 12, sm: 12, md: 4 }}
                              >
                                <Chip
                                  label={`${convertToAmPmFormat(
                                    timeRanges.from
                                  )} - ${convertToAmPmFormat(timeRanges.to)}`}
                                  onDelete={async () => {
                                    const result = await deleteTimeSlot(
                                      "friday",
                                      {
                                        from: timeRanges.from,
                                        to: timeRanges.to,
                                      }
                                    );

                                    if (result?.error) setMessage(result.error);

                                    if (result?.success) notify(result.success);
                                  }}
                                />
                              </Grid2>
                            );
                          }
                        )
                      ) : (
                        <Typography color="text.secondary" variant="body2">
                          No Opening Hours
                        </Typography>
                      )}
                    </Grid2>
                  </PropertyListItem>
                  <Divider />
                  <PropertyListItem align={align} label="SATURDAY">
                    <Grid2 container rowSpacing={2} columnSpacing={1}>
                      {openingHours.saturday.length > 0 ? (
                        openingHours.saturday.map(
                          (
                            timeRanges: { from: string; to: string },
                            index: number
                          ) => {
                            return (
                              <Grid2
                                key={index}
                                size={{ xs: 12, sm: 12, md: 4 }}
                              >
                                <Chip
                                  label={`${convertToAmPmFormat(
                                    timeRanges.from
                                  )} - ${convertToAmPmFormat(timeRanges.to)}`}
                                  onDelete={async () => {
                                    const result = await deleteTimeSlot(
                                      "saturday",
                                      {
                                        from: timeRanges.from,
                                        to: timeRanges.to,
                                      }
                                    );

                                    if (result?.error) setMessage(result.error);

                                    if (result?.success) notify(result.success);
                                  }}
                                />
                              </Grid2>
                            );
                          }
                        )
                      ) : (
                        <Typography color="text.secondary" variant="body2">
                          No Opening Hours
                        </Typography>
                      )}
                    </Grid2>
                  </PropertyListItem>
                  <Divider />
                  <PropertyListItem align={align} label="SUNDAY">
                    <Grid2 container spacing={2}>
                      {openingHours.sunday.length > 0 ? (
                        openingHours.sunday.map(
                          (
                            timeRanges: { from: string; to: string },
                            index: number
                          ) => {
                            return (
                              <Grid2
                                key={index}
                                size={{ xs: 12, sm: 12, md: 4 }}
                              >
                                <Chip
                                  label={`${convertToAmPmFormat(
                                    timeRanges.from
                                  )} - ${convertToAmPmFormat(timeRanges.to)}`}
                                  onDelete={async () => {
                                    const result = await deleteTimeSlot(
                                      "sunday",
                                      {
                                        from: timeRanges.from,
                                        to: timeRanges.to,
                                      }
                                    );

                                    if (result?.error) setMessage(result.error);

                                    if (result?.success) notify(result.success);
                                  }}
                                />
                              </Grid2>
                            );
                          }
                        )
                      ) : (
                        <Typography color="text.secondary" variant="body2">
                          No Opening Hours
                        </Typography>
                      )}
                    </Grid2>
                  </PropertyListItem>
                </PropertyList>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>
      <ModalBox open={open} onClose={handleClose} title="Add Opening Hours">
        <AddOpeningHours onClose={handleClose} />
      </ModalBox>
    </>
  );
}

export default OpeningHours;
