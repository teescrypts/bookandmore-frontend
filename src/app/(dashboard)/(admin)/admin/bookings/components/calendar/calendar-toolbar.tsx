import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material";
import ChevronLeft from "@/icons/untitled-ui/duocolor/chevron-left";
import ChevronRight from "@/icons/untitled-ui/duocolor/chevron-right";
import Add from "@/icons/untitled-ui/duocolor/add";

const viewOptions = [
  {
    label: "Month",
    value: "dayGridMonth",
  },
  {
    label: "Week",
    value: "timeGridWeek",
  },
  {
    label: "Day",
    value: "timeGridDay",
  },
  {
    label: "Agenda",
    value: "listWeek",
  },
];

type PropTypes = {
  date: Date;
  onDateToday: () => void;
  onDatePrev: () => void;
  onDateNext: () => void;
  onAddClick: () => void;
  onViewChange: (view: string) => void;
  view: string;
};

export const CalendarToolbar = (props: PropTypes) => {
  const {
    date,
    onAddClick,
    onDateNext,
    onDatePrev,
    onDateToday,
    onViewChange,
    view,
    ...other
  } = props;
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const handleViewChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onViewChange?.(event.target.value);
    },
    [onViewChange]
  );

  const dateMonth = format(date, "MMMM");
  const dateDay = format(date, "y");

  // On mobile allow only timeGridDay and agenda views

  const availableViewOptions = useMemo(() => {
    return mdUp
      ? viewOptions
      : viewOptions.filter((option) =>
          ["timeGridDay", "listWeek"].includes(option.value)
        );
  }, [mdUp]);

  return (
    <Stack
      alignItems="center"
      flexWrap="wrap"
      justifyContent="space-between"
      flexDirection={{
        xs: "column",
        md: "row",
      }}
      spacing={3}
      sx={{ px: 3 }}
      {...other}
    >
      <Stack alignItems="center" direction="row" spacing={1}>
        <Typography variant="h5">{dateMonth}</Typography>
        <Typography sx={{ fontWeight: 400 }} variant="h5">
          {dateDay}
        </Typography>
      </Stack>
      <Stack alignItems="center" direction="row" spacing={1}>
        <IconButton onClick={onDatePrev}>
          <SvgIcon>
            <ChevronLeft />
          </SvgIcon>
        </IconButton>
        <Button variant="contained" onClick={onDateToday}>
          TODAY
        </Button>
        <IconButton onClick={onDateNext}>
          <SvgIcon>
            <ChevronRight />
          </SvgIcon>
        </IconButton>
        <TextField
          label="View"
          name="view"
          onChange={(e) => handleViewChange(e)}
          select
          variant="outlined"
          slotProps={{ select: { native: true } }}
          size="small"
          sx={{
            minWidth: 120,
            order: {
              xs: -1,
              md: 0,
            },
          }}
          value={view}
        >
          {availableViewOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        {/* <Button
          onClick={onAddClick}
          startIcon={
            <SvgIcon>
              <Add />
            </SvgIcon>
          }
          sx={{
            width: {
              xs: "100%",
              md: "auto",
            },
          }}
          variant="contained"
        >
          Walk ins
        </Button> */}
      </Stack>
    </Stack>
  );
};
