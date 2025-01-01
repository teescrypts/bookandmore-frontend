import {
  Dialog,
  Box,
  Typography,
  Stack,
  FormControlLabel,
  Switch,
  Divider,
  Button,
  Card,
  CardActions,
  CardContent,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { addMinutes, isPast } from "date-fns";
import React, { useMemo } from "react";
import BookedServicesList from "./booked-service-list";
import { CalendarAppointmentType } from "@/app/actions/action-types";
import ModalBox from "@/components/modal";

interface Event {
  id?: string;
  allDay?: boolean;
  description?: string;
  end?: number;
  start?: number;
  title?: string;
  color?: string;
}

const useInitialValues = (
  event?: Event,
  range?: { start: number; end: number }
) => {
  return useMemo(() => {
    if (event) {
      return {
        allDay: event.allDay || false,
        color: event.color || "",
        description: event.description || "",
        end: event.end ? new Date(event.end) : addMinutes(new Date(), 30),
        start: event.start ? new Date(event.start) : new Date(),
        title: event.title || "",
        submit: null,
      };
    }

    if (range) {
      return {
        allDay: false,
        color: "",
        description: "",
        end: new Date(range.end),
        start: new Date(range.start),
        title: "",
        submit: null,
      };
    }

    return {
      allDay: false,
      color: "",
      description: "",
      end: addMinutes(new Date(), 30),
      start: new Date(),
      title: "",
      submit: null,
    };
  }, [event, range]);
};

type PropTypes = {
  action: "create" | "update";
  event?: CalendarAppointmentType;
  onAddComplete?: () => void;
  onClose: () => void;
  onDeleteComplete?: () => void;
  onEditComplete?: () => void;
  open: boolean;
  range?: { start: number; end: number };
};

function CalendarEventDialog({
  action = "create",
  event,
  // onAddComplete,
  onClose,
  // onDeleteComplete,
  // onEditComplete,
  open = false,
  range,
}: PropTypes) {
  const initialValues = useInitialValues(event, range);

  const handleCancel = (id: string) => {
    console.log("Canceling appointment with ID:", id);
    // Your cancellation logic here (API call, etc.)
  };

  return (
    <ModalBox
      title={action === "create" ? "Add Walk in" : "Manage Appointment"}
      onClose={onClose}
      open={open}
    >
      {event ? (
        <Stack spacing={2} justifyContent={"center"}>
          <Stack justifyContent={"center"} alignItems={"center"}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {event.service.name}
            </Typography>
            {event.service.description && (
              <Typography variant="body2" color="text.secondary">
                {event.service.description}
              </Typography>
            )}
          </Stack>
          <Divider sx={{ marginY: 2 }} />

          <Stack justifyContent={"center"} alignItems={"center"}>
            <Typography variant="subtitle1" fontWeight="bold">
              Booking ID:
            </Typography>
            <Typography variant="body2">{event._id}</Typography>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ marginTop: 2 }}
            >
              Date & Time:
            </Typography>
            <Typography variant="body2">
              {event.date}, {event.bookedTime.from} - {event.bookedTime.to}
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ marginTop: 2 }}
            >
              Customer:
            </Typography>
            <Typography variant="body2">
              {event.owner.fname} {event.owner.lname} ({event.owner.email})
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ marginTop: 2 }}
            >
              Staff:
            </Typography>
            <Typography variant="body2">
              {event.staff.fname} {event.staff.lname} ({event.staff.email})
            </Typography>

            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ marginTop: 2 }}
            >
              Status:
            </Typography>
            <Typography variant="body2">{event.status}</Typography>
          </Stack>

          <Divider />
          <Stack>
            <Stack justifyContent={"center"} direction="row" spacing={1}>
              {event.status === "pending" && (
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  // onClick={() => onCancel(_id)}
                >
                  Cancel Appointment
                </Button>
              )}
              {event.isPast && event.policy?.noShowFee?.enabled && (
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  // onClick={() => onChargeNoShow(_id)}
                >
                  Charge No Show
                </Button>
              )}
              {event.isPast && (
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  // onClick={() => onMarkComplete(_id)}
                >
                  Mark Complete
                </Button>
              )}
            </Stack>
          </Stack>
        </Stack>
      ) : (
        <Typography>No event</Typography>
      )}
    </ModalBox>
  );
}

export default CalendarEventDialog;
