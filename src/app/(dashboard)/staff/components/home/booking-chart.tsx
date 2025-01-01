"use client";

import { Chart } from "@/components/chart";
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

const useChartOptions = (xAxis: string[]) => {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [theme.palette.primary.main],
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "solid",
      fillOpacity: 0.7,
    },
    grid: {
      show: true,
      padding: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
      },
    },
    stroke: {
      curve: "smooth" as const,
      width: 0,
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      enabled: false,
    },
    xaxis: { categories: xAxis },
    yaxis: {
      show: true,
    },
  };
};

function BookingChart() {
  const chartOptions = useChartOptions([
    "july 10",
    "july 11",
    "july 12",
    "july 13",
    "july 14",
    "july 15",
    "july 16",
  ]);

  return (
    <Card sx={{ my: 4 }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack
            sx={{ px: 2 }}
            direction={"row"}
            justifyContent={"space-between"}
          >
            <Typography variant="h5">Appointments</Typography>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="rangle-label-id">Range</InputLabel>
              <Select
                labelId="rangle-label-id"
                id="rangle-label-select-id"
                value={7}
                label="Range"
                // onChange={handleChange}
              >
                <MenuItem value={7}>7 Days Ago</MenuItem>
                <MenuItem value={14}>14 Days Ago</MenuItem>
                <MenuItem value={30}>30 Days Ago</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Chart
            height={400}
            width={"100%"}
            options={chartOptions}
            series={[
              { name: "Appointments", data: [10, 12, 13, 14, 15, 12, 15] },
            ]}
            type="area"
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default BookingChart;
