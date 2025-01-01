import React from "react";
import {
  Typography,
  Button,
  Stack,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import Link from "next/link";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import RentListClient from "./rent-list-client";
import { staffPaths } from "@/paths";

interface Rent {
  _id: string;
  tenant: {
    fname: string;
    lname: string;
    email: string;
  };
  status: string;
  paidOn: number;
  dueOn: number;
}

interface Response {
  error?: string;
  message?: {
    rents: Rent[];
    pendingFormCount: number;
  };
}

const RentList: React.FC = async () => {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/rents", {
    token: session,
    tag: "fetchRentsAndPr",
  });

  if (response?.error) throw new Error(response.error);

  const rents = response.message!.rents;
  const pendingFormCount = response.message!.pendingFormCount;

  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" fontWeight="bold">
            Rented Booths
          </Typography>
          <Stack direction="row" spacing={1}>
            <Link href={staffPaths.dashboard.rent.rentForm}>
              <Button variant="contained" color="primary" size="small">
                Create Rent Form
              </Button>
            </Link>

            <Link href={staffPaths.dashboard.rent.rentLinks}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                endIcon={
                  <Chip label={pendingFormCount} size="small" color="primary" />
                }
              >
                Pending Rent Forms
              </Button>
            </Link>
          </Stack>
        </Stack>

        <RentListClient rents={rents} />
      </CardContent>
    </Card>
  );
};

export default RentList;
