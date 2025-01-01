"use client";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CalendarToolbar } from "./calendar-toolbar";
import { CalendarContainer } from "./calendar-container";
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import timelinePlugin from "@fullcalendar/timeline";
import { useDialog } from "@/app/(dashboard)/hooks/use-dialog";
import { EventClickArg, EventContentArg } from "@fullcalendar/core/index.js";
import CalendarEventDialog from "./calender-event-dialog";
import { DateTime } from "luxon";
import getDateRange from "@/utils/get-date-range";
import { getStaffAppointments } from "@/app/actions/actions";
import { CalendarAppointmentType } from "@/app/actions/action-types";
import { format } from "date-fns";

interface Event {
  id?: string;
  allDay?: boolean;
  description?: string;
  end?: number;
  start?: number;
  title?: string;
  color?: string;
}

interface DialogDataType extends Event {
  eventId?: string;
}

const useCurrentEvent = (
  events: CalendarAppointmentType[],
  dialogData?: DialogDataType | string
) => {
  return useMemo(() => {
    if (!dialogData) {
      return undefined;
    }

    if (typeof dialogData !== "string") {
      return events.find((event) => event._id === dialogData.eventId);
    }
  }, [dialogData, events]);
};

interface EventInfoProps {
  eventInfo: EventContentArg;
  mdUp: boolean;
}

const EventContent: React.FC<EventInfoProps> = ({ eventInfo, mdUp }) => {
  const theme = useTheme();
  const { start, end, title, backgroundColor } = eventInfo.event;

  return (
    <Box
      sx={{
        backgroundColor: backgroundColor || "gray",
        color: "#fff",
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "0.85rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: "bold",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </Typography>
      {/* {mdUp && (
        <Typography variant="caption">
          {start ? format(new Date(start), "hh:mm a") : ""}
          {end ? ` - ${format(new Date(end), "hh:mm a")}` : ""}
        </Typography>
      )} */}
    </Box>
  );
};

function CalendarUi({ timeZone }: { timeZone: string }) {
  const [events, setEvents] = useState<CalendarAppointmentType[]>([]);
  const calendarRef = useRef<Calendar | null>(null);
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  const today = DateTime.now().setZone(timeZone).startOf("day").toJSDate();
  const [date, setDate] = useState(today);
  const [view, setView] = useState<"timeGridDay" | "dayGridMonth">(
    mdUp ? "dayGridMonth" : "timeGridDay"
  );
  const [loading, setLoading] = useState(false);
  const createDialog = useDialog();
  const updateDialog = useDialog();
  const updatingEvent = useCurrentEvent(events, updateDialog.data);
  const [errMsg, setErrMsg] = useState("");

  const fetchAppointments = useCallback(
    async (startDate: string, endDate: string) => {
      setLoading(true);
      const result = await getStaffAppointments(startDate, endDate);

      if (result?.error) {
        setErrMsg(result.error);
        setLoading(false);
      }

      if (result?.success) {
        const apts = result.success;
        const events = apts.map((apt) => {
          const dateTimeStrStart = `${apt.date}T${apt.bookedTime.from}:00`;
          const dateTimeStart = new Date(dateTimeStrStart);
          const start = dateTimeStart.getTime();

          const dateTimeStrEnd = `${apt.date}T${apt.bookedTime.to}:00`;
          const dateTimeEnd = new Date(dateTimeStrEnd);
          const end = dateTimeEnd.getTime();

          return {
            ...apt,
            id: apt._id,
            allDay: false,
            color: apt.service.color,
            description: apt.service.description,
            end,
            start,
            title: apt.service.name,
          };
        });

        setEvents(events);
      }

      setLoading(false);
    },
    [date]
  );

  useEffect(() => {
    if (date) {
      const { startDate, endDate } = getDateRange(date);
      if (startDate && endDate) fetchAppointments(startDate, endDate);
    }
  }, [date]);

  const handleScreenResize = useCallback(() => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = mdUp ? "dayGridMonth" : "timeGridDay";

      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [calendarRef, mdUp]);

  useEffect(() => {
    handleScreenResize();
  }, [mdUp, handleScreenResize]);

  const updateDateFromCalendar = (calendarApi: any) => {
    const newDate = DateTime.fromJSDate(calendarApi.getDate())
      .setZone(timeZone)
      .toJSDate();
    setDate(newDate);
  };

  const handleDateNext = useCallback(() => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      updateDateFromCalendar(calendarApi);
    }
  }, [timeZone]);

  const handleDatePrev = useCallback(() => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      updateDateFromCalendar(calendarApi);
    }
  }, [timeZone]);

  const handleDateToday = useCallback(() => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      updateDateFromCalendar(calendarApi);
    }
  }, [timeZone]);

  const handleViewChange = useCallback((view: string) => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(view);
      setView(view as "dayGridMonth" | "timeGridDay");
    }
  }, []);

  const handleAddClick = useCallback(() => {
    createDialog.handleOpen();
  }, []);

  const handleEventSelect = useCallback(
    (arg: EventClickArg) => {
      updateDialog.handleOpen({
        eventId: arg.event.id,
      });

      arg.jsEvent.preventDefault();
      arg.jsEvent.stopPropagation();
    },
    [updateDialog]
  );

  return (
    <>
      <Stack spacing={3}>
        <CalendarToolbar
          date={date}
          onAddClick={handleAddClick}
          onDateNext={handleDateNext}
          onDatePrev={handleDatePrev}
          onDateToday={handleDateToday}
          onViewChange={handleViewChange}
          view={view}
        />

        {loading && (
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <CircularProgress />
            <Typography variant="subtitle2">Loading Appointments...</Typography>
          </Stack>
        )}

        <Typography textAlign={"center"} color="error" variant="subtitle2">
          {errMsg}
        </Typography>

        <Card>
          <CalendarContainer>
            <Calendar
              allDayMaintainDuration
              dayMaxEventRows={10}
              editable
              eventClick={handleEventSelect}
              eventDisplay="block"
              eventResizableFromStart
              events={events}
              eventContent={(eventInfo) => (
                <EventContent mdUp={mdUp} eventInfo={eventInfo} />
              )}
              headerToolbar={false}
              height={800}
              initialDate={date}
              initialView={view}
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                listPlugin,
                timeGridPlugin,
                timelinePlugin,
              ]}
              ref={calendarRef}
              rerenderDelay={10}
              weekends
            />
          </CalendarContainer>
        </Card>
      </Stack>

      {/* {createDialog.data && typeof createDialog.data !== "string" && ( */}
        <CalendarEventDialog
          action="create"
          onAddComplete={createDialog.handleClose}
          onClose={createDialog.handleClose}
          open={createDialog.open}
          // range={createDialog.data.range}
        />
      {/* )} */}

      {updatingEvent && (
        <CalendarEventDialog
          action="update"
          event={updatingEvent}
          onClose={updateDialog.handleClose}
          onDeleteComplete={updateDialog.handleClose}
          onEditComplete={updateDialog.handleClose}
          open={updateDialog.open}
        />
      )}
    </>
  );
}

export default CalendarUi;
