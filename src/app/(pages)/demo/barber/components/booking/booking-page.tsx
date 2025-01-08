"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  Card,
  Avatar,
  useTheme,
  SvgIcon,
  Container,
  CircularProgress,
  CardActions,
  CardContent,
  Grid2,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Checkbox,
  Alert,
} from "@mui/material";
import Locations from "@/icons/untitled-ui/duocolor/location";
import { BranchType } from "../../booking/page";
import {
  bookAppointment,
  calculateTax,
  fetchAvailability,
  fetchBookingSettings,
  fetchServices,
  fetchValidCouponService,
} from "@/app/actions/actions";
import {
  Availability,
  BookingSettingType,
  CustomerServiceType,
  CustomerStaffsType,
  ValidCouponService,
} from "@/app/actions/action-types";
import EmptyState from "@/components/empty-state";
import FilledTime from "@/icons/untitled-ui/duocolor/filled-time";
import AttachMoney from "@/icons/untitled-ui/duocolor/attach-money";
import { API_BASE_URL } from "@/paths";
import { format, parseISO } from "date-fns";
import ChevronLeft from "@/icons/untitled-ui/duocolor/chevron-left";
import ChevronRight from "@/icons/untitled-ui/duocolor/chevron-right";
import { Scrollbar } from "@/components/scrollbar";
import { convertTo12HourFormat } from "@/utils/convert-to-12hrs-format";
import ArrowBack from "@/icons/untitled-ui/duocolor/arrow-back";
import addDurationToTime from "@/utils/add-duration-to-time";
import removeHoursFromDateTime from "@/utils/remove-hrs-from-date-time";
import formatDateToReadable from "@/utils/format-date-to-readable";
import { convertToAmPmFormat } from "@/utils/convert-to-am-pm";
import { useClientData } from "@/app/authentication/frontend/auth-context";
import ModalBox from "@/components/modal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CheckDone01 from "@/icons/untitled-ui/duocolor/check-done-01";
import Close from "@/icons/untitled-ui/duocolor/close";
import formatDateTimeWithTimeZone from "@/utils/format-date-with-time-zone";

const steps = [
  "Select Location",
  "Select Services",
  "Select Staff",
  "Date & Time",
  "Policy",
];

type Slot = string;
type DateItem = {
  date: string;
  slots: Slot[];
};

const BookingPage = ({ locations }: { locations: BranchType[] }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedLocationName, setselectedLocationName] = useState<string>("");
  const [selectedLocationTz, setselectedLocationTz] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateItem | null>(null);
  const [selectedSlot, setSlectedSlot] = useState("");
  const [settings, setSettings] = useState<BookingSettingType | null>(null);
  const [acceptPolicy, setAcceptPolicy] = useState(false);

  const [services, setServices] = useState<CustomerServiceType[]>();
  const [staffs, setStaffs] = useState<CustomerStaffsType[]>();

  const [fetchingData, setFetchingData] = useState(false);
  const [message, setMessage] = useState("");

  const theme = useTheme();

  const handleNext = () => {
    if (activeStep === 0 && !selectedLocation)
      return alert("Please select a location");

    if (activeStep === 2 && !selectedService)
      return alert("Please selecct a staff");

    if (activeStep === 3 && !selectedDate) return alert("Please select a date");

    if (activeStep === 3 && !selectedSlot) return alert("Please select a Time");

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeStep === 2) {
      setSelectedService("");
      setCoupons("");
    }
    setActiveStep((prev) => prev - 1);
  };

  const fetchingServices = useCallback(async () => {
    if (selectedLocation) {
      setFetchingData(true);
      const result = await fetchServices(selectedLocation);

      if (result?.error) setMessage(result.error);
      if (result?.success) setServices(result.success);
      setFetchingData(false);
    }
  }, [activeStep, selectedLocation]);

  const fetchSlots = useCallback(async () => {
    if (selectedStaff && services) {
      setFetchingData(true);
      const selectedServiceArr = services.filter(
        (service) => service._id === selectedService
      );

      const serviceEstTime = selectedServiceArr[0].estimatedTime;

      const result = await fetchAvailability(
        selectedLocation,
        selectedStaff,
        serviceEstTime
      );

      if (result?.error) {
        setMessage(result.error);
        setDates([]);
        setFetchingData(false);
      }

      if (result.success) {
        const slotData = result.success;
        if (typeof slotData !== "string") {
          setDates(slotData);
        } else {
          setMessage(slotData);
          setDates([]);
        }

        setFetchingData(false);
      }
    }
  }, [activeStep]);

  const fetchSettings = useCallback(async () => {
    if (
      selectedLocation &&
      selectedService &&
      selectedStaff &&
      selectedDate &&
      selectedSlot
    ) {
      setFetchingData(true);
      const result = await fetchBookingSettings(selectedLocation);

      if (result?.error) {
        setMessage(result.error);
        setFetchingData(false);
      }

      if (result?.success) {
        const settings = result.success;
        if (typeof settings === "string") {
          setMessage(settings);
          setFetchingData(false);
        } else {
          setSettings(settings);
          setFetchingData(false);
        }
      }
    }
  }, [activeStep]);

  // -------------------------------------

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isProgrammaticScroll, setIsProgrammaticScroll] =
    useState<boolean>(false);

  const scrollbarRef = useRef<any>(null);
  const [dates, setDates] = useState<Availability[]>([]);

  const handleDateClick = (date: DateItem) => {
    if (date.slots.length > 0) {
      setSelectedDate(date);
    }
  };

  const handleSlotClick = (slot: Slot) => {
    setSlectedSlot(slot);
  };

  const handleScrollLeft = () => {
    if (currentIndex > 0) {
      setIsProgrammaticScroll(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleScrollRight = () => {
    if (currentIndex < dates.length - 1) {
      setIsProgrammaticScroll(true);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    // Programmatically scroll to the correct position when currentIndex changes
    if (scrollbarRef.current && isProgrammaticScroll) {
      const scrollbarElement = scrollbarRef.current.getScrollElement();
      const itemWidth = scrollbarElement.scrollWidth / dates.length;
      scrollbarElement.scrollTo({
        left: currentIndex * itemWidth,
        behavior: "smooth",
      });

      // Reset the flag after the programmatic scroll
      const timer = setTimeout(() => setIsProgrammaticScroll(false), 300); // Allow smooth scroll to complete
      return () => clearTimeout(timer);
    }
  }, [currentIndex, dates.length, isProgrammaticScroll]);

  useEffect(() => {
    // Update currentIndex based on manual scrolling/swiping
    const handleScroll = () => {
      if (isProgrammaticScroll) return; // Skip manual scroll updates during programmatic scroll

      if (scrollbarRef.current) {
        const scrollbarElement = scrollbarRef.current.getScrollElement();
        const itemWidth = scrollbarElement.scrollWidth / dates.length;
        const newIndex = Math.round(scrollbarElement.scrollLeft / itemWidth);

        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
        }
      }
    };

    const scrollbarElement = scrollbarRef.current?.getScrollElement();
    scrollbarElement?.addEventListener("scroll", handleScroll);

    return () => {
      scrollbarElement?.removeEventListener("scroll", handleScroll);
    };
  }, [currentIndex, dates.length, isProgrammaticScroll]);

  const [bookedTime, setBookedTime] = useState<{ from: string; to: string }>();
  const [bufferTime, setBufferTime] = useState<{ from: string; to: string }>();
  const [price, setPrice] = useState<number>();
  const [cancellationFee, setCancellationFee] = useState<number>();
  const [noShowFee, setNoShowFee] = useState<number>();
  const [amount, setAmount] = useState<
    | {
        amountTotal: number;
        amountTax: number;
      }
    | undefined
  >();

  const fetchCalculatedTax = useCallback(
    async (selectedServiceObj: CustomerServiceType) => {
      setFetchingData(true);
      const result = await calculateTax(
        selectedLocation,
        selectedServiceObj.priceAmount,
        selectedServiceObj.stripeData.productId,
        selectedServiceObj.name
      );

      if (result?.error) setMessage(result.error);
      if (result?.success) {
        const amountData = result.success;
        const amount = {
          amountTotal: amountData[0].amount,
          amountTax: amountData[0].amount_tax,
        };

        setAmount(amount);
      }
      setFetchingData(false);
    },
    [selectedLocation, selectedService]
  );

  useEffect(() => {
    if (settings) {
      if (services) {
        const selectedServiceObj = services.find(
          (service) => service._id === selectedService
        );

        if (selectedServiceObj) {
          fetchCalculatedTax(selectedServiceObj);
          setPrice(selectedServiceObj.priceAmount);
          if (settings.policy.cancelFeeValue) {
            if (settings.policy.feeTypeForCancel === "fixed") {
              setCancellationFee(settings.policy.cancelFeeValue);
            } else {
              const cancellationFee =
                (settings.policy.cancelFeeValue / 100) *
                selectedServiceObj.priceAmount;

              setCancellationFee(Number(cancellationFee.toFixed(2)));
            }
          }

          if (settings.policy.collectNoshowFee) {
            if (settings.policy.feeTypeForNoshow === "fixed") {
              setNoShowFee(settings.policy.noshowFeeValue);
            } else {
              const cancellationFee =
                (settings.policy.noshowFeeValue / 100) *
                selectedServiceObj.priceAmount;

              setNoShowFee(Number(cancellationFee.toFixed(2)));
            }
          }

          const bookedServiceEndsAt = addDurationToTime(
            selectedSlot,
            selectedServiceObj.estimatedTime
          );

          const bookedServiceEndsAtWithBufferTime = addDurationToTime(
            bookedServiceEndsAt,
            selectedServiceObj.bufferTime
          );

          setBookedTime({ from: selectedSlot, to: bookedServiceEndsAt });
          setBufferTime({
            from: selectedSlot,
            to: bookedServiceEndsAtWithBufferTime,
          });
        }
      }
    }
  }, [settings]);

  // -------------------------------------

  useEffect(() => {
    if (activeStep === 0) {
      setServices(undefined);
    }

    if (activeStep === 1) {
      fetchingServices();
    }

    if (activeStep === 2) {
      if (selectedDate) {
        setSelectedDate(null);
      }

      if (selectedSlot) {
        setSlectedSlot("");
      }

      if (selectedService && services && services.length > 0) {
        setFetchingData(true);
        const selectedServiceArr = services.filter(
          (service) => service._id === selectedService
        );
        const staffs = selectedServiceArr[0].staffs;

        setStaffs(staffs);
        setFetchingData(false);
      }
    }

    if (activeStep === 3) {
      fetchSlots();
    }

    if (activeStep === 4) {
      fetchSettings();
    }
  }, [activeStep]);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: {
        return (
          <Box>
            <RadioGroup
              value={selectedLocation}
              onChange={(e) => {
                const selectedBranch = locations.find(
                  (location) => location._id === e.target.value
                );
                setselectedLocationName(selectedBranch!.name);
                setselectedLocationTz(selectedBranch!.timeZone);
                setSelectedLocation(e.target.value);
              }}
            >
              {locations.map((location, idx) => (
                <FormControlLabel
                  key={idx}
                  value={location._id}
                  onChange={() => {}}
                  control={
                    <Radio onChange={() => {}} sx={{ display: "none" }} />
                  }
                  label={
                    <Card
                      elevation={selectedLocation === location._id ? 6 : 2}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        mb: 2,
                        cursor: "pointer",
                        transition: "0.3s",
                        borderRadius: 2,
                        border:
                          selectedLocation === location._id
                            ? `2px solid ${theme.palette.primary.main}`
                            : "none",
                        "&:hover": {
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                        },
                      }}
                    >
                      <SvgIcon sx={{ fontSize: 40, color: "primary", mr: 2 }}>
                        <Locations />
                      </SvgIcon>

                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {location.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {`${location.address.line1}, ${location.address.city.cityName}, ${location.address.state.stateCode}`}
                        </Typography>
                      </Box>
                    </Card>
                  }
                />
              ))}
            </RadioGroup>
          </Box>
        );
        break;
      }

      case 1: {
        if (fetchingData) {
          return (
            <Stack alignItems={"center"} justifyContent={"center"}>
              <CircularProgress />
            </Stack>
          );
        } else {
          return (
            <Box>
              {services && services.length ? (
                <Grid2 container spacing={3}>
                  {services.map((service, idx) => (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                      <Card elevation={3} sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {service.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {service.description}
                          </Typography>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ mb: 1 }}
                          >
                            <Box display="flex" alignItems="center">
                              <SvgIcon fontSize="small" sx={{ mr: 0.5 }}>
                                <FilledTime />
                              </SvgIcon>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {`${service.estimatedTime.hours} hr ${service.estimatedTime.minutes} min`}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                              <SvgIcon fontSize="small" sx={{ mr: 0.5 }}>
                                <AttachMoney />
                              </SvgIcon>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                ${service.priceAmount}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                        <CardActions>
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => {
                              setSelectedService(service._id);
                              handleNext();
                            }}
                          >
                            Select Service
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid2>
                  ))}
                </Grid2>
              ) : (
                <EmptyState message="We are still setting up. Please try again later" />
              )}
            </Box>
          );
        }
        break;
      }

      case 2: {
        return (
          <Box sx={{ mt: 2 }}>
            <RadioGroup
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
            >
              {staffs && staffs.length > 0 ? (
                <Grid2 container spacing={3}>
                  {staffs.map((staff) => (
                    <Grid2
                      size={{ xs: 6, md: 4 }}
                      key={staff._id}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControlLabel
                        value={staff._id}
                        onChange={() => {}}
                        disabled={!staff.active}
                        control={<Radio sx={{ display: "none" }} />}
                        label={
                          <Card
                            elevation={selectedStaff === staff._id ? 6 : 2}
                            sx={{
                              width: "100%", // Ensures cards take full column width
                              maxWidth: "250px", // Optional: limit maximum width
                              textAlign: "center",
                              cursor: "pointer",
                              transition: "all 0.3s ease-in-out",
                              borderRadius: 4,
                              border:
                                selectedStaff === staff._id
                                  ? `2px solid ${theme.palette.primary.main}`
                                  : `1px solid ${theme.palette.grey[300]}`,
                              "&:hover": {
                                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                              },
                              opacity: staff.active ? 1 : 0.5,
                            }}
                          >
                            <CardContent>
                              <Avatar
                                src={`${API_BASE_URL}/api/users/${staff._id}/avatar`}
                                alt={`${staff.fname} ${staff.lname}`}
                                sx={{
                                  width: 80,
                                  height: 80,
                                  mx: "auto",
                                  mb: 2,
                                  border: `2px solid ${
                                    selectedStaff === staff._id
                                      ? theme.palette.primary.main
                                      : theme.palette.grey[300]
                                  }`,
                                }}
                              />

                              <Typography
                                sx={{
                                  minWidth: { md: "200px", xs: "150px" },
                                  maxWidth: { md: "200px", xs: "150px" },
                                }}
                                variant="h6"
                                noWrap
                              >
                                {`${staff.fname} ${staff.lname}`}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                              >
                                {staff.active ? "Available" : "Unavailable"}
                              </Typography>
                            </CardContent>
                          </Card>
                        }
                      />
                    </Grid2>
                  ))}
                </Grid2>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    p: 4,
                    border: `1px dashed ${theme.palette.grey[400]}`,
                    borderRadius: 2,
                    mt: 4,
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Sorry, we are still setting up. Please try again later.
                  </Typography>
                </Box>
              )}
            </RadioGroup>
          </Box>
        );
        break;
      }

      case 3: {
        if (fetchingData) {
          return (
            <Stack alignItems={"center"} justifyContent={"center"}>
              <CircularProgress />
            </Stack>
          );
        }

        // Wrap the conditional in parentheses
        return dates.length > 0 ? (
          <Box sx={{ p: 2 }}>
            {/* Display the month and year of the currently visible date */}
            {dates[currentIndex] && (
              <Typography variant="h5" align="center" gutterBottom>
                {`${format(parseISO(dates[currentIndex].date), "MMMM yyyy")}`}
              </Typography>
            )}

            {/* Date slider with Scrollbar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                mb: 2,
              }}
            >
              <IconButton
                onClick={handleScrollLeft}
                disabled={currentIndex === 0}
              >
                <ChevronLeft />
              </IconButton>

              <Scrollbar ref={scrollbarRef} style={{ width: "100%" }}>
                <Grid2 container wrap="nowrap" spacing={2}>
                  {dates.map((date, index) => (
                    <Grid2
                      key={date.date}
                      sx={{
                        flex: "0 0 auto",
                        textAlign: "center",
                        cursor:
                          date.slots.length > 0 ? "pointer" : "not-allowed",
                      }}
                    >
                      <Button
                        variant={
                          selectedDate?.date === date.date
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() => handleDateClick(date)}
                        disabled={date.slots.length === 0}
                        sx={{ my: 6 }}
                        size="small"
                      >
                        <Box>
                          <Typography variant="subtitle1">
                            {format(parseISO(date.date), "d")}
                          </Typography>
                          <Typography variant="subtitle2">
                            {format(parseISO(date.date), "EEEE")}
                          </Typography>
                        </Box>
                      </Button>
                    </Grid2>
                  ))}
                </Grid2>
              </Scrollbar>

              <IconButton
                onClick={handleScrollRight}
                disabled={currentIndex === dates.length - 1}
              >
                <ChevronRight />
              </IconButton>
            </Box>

            {/* Slot display */}
            {selectedDate && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Slots for {format(parseISO(selectedDate.date), "PPPP")}:
                </Typography>

                {selectedDate.slots.length > 0 ? (
                  <Grid2 container spacing={2}>
                    {selectedDate.slots.map((slot, index) => (
                      <Grid2 size={{ xs: 4, md: 2 }} key={index}>
                        <Button
                          variant={
                            slot === selectedSlot ? "contained" : "outlined"
                          }
                          onClick={() => handleSlotClick(slot)}
                          sx={{
                            width: "120px", // Set a fixed width for all buttons
                            textAlign: "center",
                          }}
                        >
                          {convertTo12HourFormat(slot)}
                        </Button>
                      </Grid2>
                    ))}
                  </Grid2>
                ) : (
                  <Typography>No slots available.</Typography>
                )}
              </Box>
            )}
          </Box>
        ) : (
          // Ensure EmptyState is rendered properly
          <EmptyState message={message} />
        );

        break;
      }

      case 4: {
        if (fetchingData) {
          return (
            <Stack alignItems={"center"} justifyContent={"center"}>
              <CircularProgress />
            </Stack>
          );
        }

        return settings && amount ? (
          <Stack spacing={3} sx={{ maxWidth: 600, margin: "0 auto" }}>
            {/* Appointment Details Section */}
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Appointment Details
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
                <List>
                  <ListItem>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" }, // Column on small screens, row on medium and larger
                        gap: 2, // Space between the items
                        width: "100%", // Ensure items take full width for proper alignment
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="bold">
                            Adult Cut
                          </Typography>
                        }
                        secondary={
                          selectedDate?.date &&
                          bookedTime && (
                            <Typography variant="body2" color="text.secondary">
                              {formatDateToReadable(selectedDate.date)} <br />
                              Time: {convertToAmPmFormat(
                                bookedTime.from
                              )} - {convertToAmPmFormat(bookedTime.to)} <br />
                              Branch: {selectedLocationName}
                            </Typography>
                          )
                        }
                      />
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="bold">
                            Price
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            Service Fee: {amount.amountTotal / 100} USD <br />
                            Tax: {amount.amountTax / 100} USD <br />
                            Total:{" "}
                            {(amount.amountTax + amount.amountTotal) / 100} USD
                          </Typography>
                        }
                      />
                    </Box>
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Booking Policy Section */}
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Booking Policy
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
                <List>
                  {settings.policy.collectCancelFee && selectedDate && (
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="bold">
                            Cancellation Policy
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            You may cancel this appointment without incurring a
                            fee until{" "}
                            {formatDateTimeWithTimeZone({
                              date: selectedDate.date,
                              time: selectedSlot,
                              timeZone: selectedLocationTz,
                              duration: settings.policy.cancellationNotice,
                            })}{" "}
                            <br />
                            <br />
                            Cancellation fee: {cancellationFee} USD
                          </Typography>
                        }
                      />
                    </ListItem>
                  )}

                  {settings.policy.collectNoshowFee && (
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="bold">
                            No Show Fee
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            A no-show fee of {noShowFee} USD will be applied if
                            you fail to attend your booked appointment.
                          </Typography>
                        }
                      />
                    </ListItem>
                  )}

                  {!settings.policy.collectNoshowFee &&
                    !settings.policy.collectCancelFee && (
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="body1" fontWeight="bold">
                              No show and Cancellation
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              At Impact Barbershop ({selectedLocationName}), we
                              value your time and appreciate your business.
                              While we don’t charge a cancellation or no-show
                              fee, we kindly encourage all our customers to
                              honor their appointment times. <br /> <br />
                              If you need to cancel, please do so as early as
                              possible so we can accommodate others. Arriving on
                              time ensures you receive the best service without
                              delays. Thank you for your understanding and
                              cooperation. We look forward to serving you! —
                              Impact Barbershop
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}
                </List>
              </CardContent>
            </Card>

            {/* Confirmation Section */}
            <Card elevation={3}>
              <CardContent>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={acceptPolicy}
                      onChange={(e) => setAcceptPolicy(e.target.checked)}
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      I have reviewed, understood, and verified the details
                      provided above.
                    </Typography>
                  }
                />
              </CardContent>
            </Card>
          </Stack>
        ) : (
          <EmptyState
            message={"We are still setting up. Please try again later"}
          />
        );
      }

      default:
        return null;
    }
  };

  const { isGuest } = useClientData();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openCardRequired, setOpenCardRequired] = useState(false);
  const handleOpenCardRequired = () => setOpenCardRequired(true);
  const handleCloseCardRequired = () => setOpenCardRequired(false);
  const router = useRouter();

  const [coupons, setCoupons] = useState<ValidCouponService[] | string>([]);
  const [loadingCoupons, setLoadingCoupons] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleBooking = async () => {
    setLoading(true);
    if (
      selectedDate &&
      bookedTime &&
      bufferTime &&
      settings &&
      amount &&
      selectedLocation
    ) {
      const bookingData = {
        service: selectedService,
        staff: selectedStaff,
        date: selectedDate.date,
        bookedTime: bookedTime,
        branch: selectedLocation,
        bookedTimeWithBuffer: bufferTime,
      };

      if (isGuest) {
        localStorage.setItem("pendingBooking", "present");
        const bookingDataStr = JSON.stringify(bookingData);
        localStorage.setItem("bookingData", bookingDataStr);
        handleOpen();
        setLoading(false);
      } else {
        const result = await bookAppointment(bookingData);

        if (result?.error) {
          setMessage(result.error);
          setLoading(false);
        }

        if (result?.success) {
          if (result.success === "Customer payment method required.") {
            localStorage.setItem("pendingBooking", "present");
            const bookingDataStr = JSON.stringify(bookingData);
            localStorage.setItem("bookingData", bookingDataStr);

            handleOpenCardRequired();
            setLoading(false);
            return;
          }

          router.push("/demo/barber/dashboard/appointments");
        }
      }
    }
  };

  const fetchValidCoupon = useCallback(async () => {
    try {
      if (selectedLocation && selectedService) {
        setLoadingCoupons(true);
        const result = await fetchValidCouponService(
          selectedService,
          selectedLocation
        );

        if (result?.error) {
          setError(result.error);
          setLoadingCoupons(false);
        }
        if (result?.success) {
          setCoupons(result.success);
          setLoadingCoupons(false);
        }
      }
    } catch (e) {
      throw new Error("Internal server error");
    }
  }, [selectedLocation, selectedService]);

  useEffect(() => {
    fetchValidCoupon();
  }, [selectedLocation, selectedService]);

  return (
    <Container maxWidth="xl" sx={{ minHeight: "75vh", mt: 20 }}>
      <Box>
        {loadingCoupons && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ my: 4 }}
        >
          {typeof coupons !== "string" &&
            coupons.map((coupon, index) => (
              <Alert
                key={index}
                color="info"
                severity="info"
                sx={{ textAlign: "center", my: 2 }}
              >
                {`Use Promo code ${coupon.promotionCodes.join(", ")} for ${
                  coupon.valueType
                }
                off`}
              </Alert>
            ))}
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ p: 2, minHeight: "60vh" }}>
          {renderStepContent(activeStep)}
        </Box>

        <Typography variant="subtitle2" color="error" textAlign={"center"}>
          {message}
        </Typography>

        {/* Sticky Button Container */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            py: 2,
            mt: 3,
            // boxShadow: 3,
          }}
        >
          <Card>
            <CardContent>
              <Stack direction={"row"} justifyContent={"space-between"}>
                {activeStep !== 0 && (
                  <Button startIcon={<ArrowBack />} onClick={handleBack}>
                    Back
                  </Button>
                )}
                {activeStep === steps.length - 1 ? (
                  <Button
                    disabled={!acceptPolicy || loading}
                    variant="contained"
                    color="primary"
                    onClick={handleBooking}
                  >
                    {loading ? <CircularProgress /> : "Book"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Continue
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <ModalBox open={open} onClose={handleClose}>
        <EmptyState
          message="You are not logged in"
          actionLabel="Login"
          onActionClick={() => router.push("/demo/login")}
        />

        <Typography textAlign={"center"} variant="subtitle2">
          Don't have an account? <Link href={"/demo/signup"}>Sign Up</Link>
        </Typography>
      </ModalBox>

      <ModalBox open={openCardRequired} onClose={handleCloseCardRequired}>
        <Stack
          spacing={3}
          sx={{
            p: 3,
            // bgcolor: "background.paper",
            // borderRadius: 2,
            // boxShadow: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight={500}>
            Card Required
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You will incur a charge only if you fail to attend your appointment
            or cancel outside the designated cancellation window outlined in the
            booking policy.
          </Typography>

          <Stack direction="row" justifyContent="center" spacing={2}>
            <Button
              variant="contained"
              startIcon={<CheckDone01 />}
              sx={{ textTransform: "none" }}
              onClick={() => router.push("/register/stripe-setup")}
            >
              Continue
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Close />}
              sx={{ textTransform: "none" }}
              onClick={handleCloseCardRequired}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </ModalBox>
    </Container>
  );
};

export default BookingPage;
