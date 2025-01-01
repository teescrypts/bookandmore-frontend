"use client";

import {
  Box,
  Typography,
  Stack,
  Container,
  Grid2,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import AppointmentCard from "./appointment-card";
import EmptyState from "@/components/empty-state";

export type CustomerAppointmentType = {
  _id: string;
  service: {
    _id: string;
    name: string;
    description: string;
    stripeData: {
      priceId: string;
      productId: string;
    };
  };
  price: {
    serviceFee: number;
    tax: number;
    taxRate: number;
    total: number;
  };
  policy: {
    cancelFee: {
      enabled: boolean;
      window?: number;
      fee?: number;
    };
    noShowFee: {
      enabled: boolean;
      fee?: number;
    };
  };
  staff: {
    fname: string;
    lname: string;
    email: string;
  };
  branch: { _id: string; name: string };
  date: string;
  bookedTime: {
    from: string;
    to: string;
  };
  status: "pending" | "cancelled" | "completed";
  actions: {
    cancellable: boolean;
    payable: boolean;
  };
};

interface PropType {
  appointments: CustomerAppointmentType[];
}

const AppointmentList: React.FC<PropType> = ({ appointments }) => {
  const [currentAppointments, setCurrentAppointments] =
    useState<CustomerAppointmentType[]>();

  useEffect(() => {
    setCurrentAppointments(appointments);
  }, [appointments]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
        mt: { md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          My Appointments
        </Typography>
        <Grid2 container spacing={2}>
          {!currentAppointments && (
            <Stack direction={"row"} justifyContent={"center"}>
              <CircularProgress />
            </Stack>
          )}

          {currentAppointments && currentAppointments.length > 0 ? (
            currentAppointments.map((appointment) => (
              <Grid2 size={{ xs: 12, md: 6 }} key={appointment._id}>
                <AppointmentCard appointment={appointment} />
              </Grid2>
            ))
          ) : (
            <Stack direction={"row"} justifyContent={"center"}>
              <EmptyState message="You currently have no appointments. If you’ve just added a card, please refresh the page." />
            </Stack>
          )}
        </Grid2>
      </Container>
    </Box>
  );
};

export default AppointmentList;
