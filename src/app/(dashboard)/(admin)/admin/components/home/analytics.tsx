import { Card, Grid2, Stack, SvgIcon } from "@mui/material";
import React from "react";
import AnalysisCard from "./analysis-card";
import Time from "@/icons/untitled-ui/duocolor/time";
import TrendingUp from "@/icons/untitled-ui/duocolor/trending-up";
import TrendingDown from "@/icons/untitled-ui/duocolor/trending-down";
import Users03 from "@/icons/untitled-ui/duocolor/users-03";
import LayoutAlt02 from "@/icons/untitled-ui/duocolor/layout-alt-02";
import BookingChart from "./booking-chart";

const percentage1 = 4.0;
const percentage2 = 3.6;
const percentage3 = -1.78;

function Analytics() {
  return (
    <Stack>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <AnalysisCard
            title="Appointments"
            icon={<Time />}
            value={30}
            data={`${percentage1 >= 0 ? "+" : "-"}${percentage1}% last 7 days`}
            dataIcon={
              percentage1 >= 0 ? (
                <SvgIcon color="success">
                  <TrendingUp />
                </SvgIcon>
              ) : (
                <SvgIcon color="error">
                  <TrendingDown />
                </SvgIcon>
              )
            }
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <AnalysisCard
            title="Customers"
            icon={<Users03 />}
            value={50}
            data={`${percentage2 >= 0 ? "+" : "-"}${percentage2}% last 7 days`}
            dataIcon={
              percentage2 >= 0 ? (
                <SvgIcon color="success">
                  <TrendingUp />
                </SvgIcon>
              ) : (
                <SvgIcon color="error">
                  <TrendingDown />
                </SvgIcon>
              )
            }
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <AnalysisCard
            title="Blog Page Visits"
            icon={<LayoutAlt02 />}
            value={400}
            data={`${percentage3 >= 0 ? "+" : ""}${percentage3}% last 7 days`}
            dataIcon={
              percentage3 >= 0 ? (
                <SvgIcon color="success">
                  <TrendingUp />
                </SvgIcon>
              ) : (
                <SvgIcon color="error">
                  <TrendingDown />
                </SvgIcon>
              )
            }
          />
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <BookingChart />
        </Grid2>
      </Grid2>
    </Stack>
  );
}

export default Analytics;
