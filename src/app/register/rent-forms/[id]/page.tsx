import React from "react";
import BoothRentForm from "../../components/booth-rent-form";
import { Box } from "@mui/material";
import apiRequest from "@/utils/api-request";

export interface RentForm {
  _id: string;
  admin: string;
  branch: string;
  category: "one time pay" | "subscription";
  oneTimePay?: {
    price: number;
    duration: number;
    startDate: Date;
  };
  subscription?: {
    interval: "week" | "month";
    amount: number;
    description?: string;
    stripePriceId: string;
  };
  tenantInfo: {
    fname: string;
    lname: string;
    email: string;
  };
  note: string;
}

interface Response {
  error?: string;
  message?: RentForm;
}

async function Page({ params }: { params: { id: string } }) {
  const response = await apiRequest<Response>(`/api/rent-forms/${params.id}`, {
    tag: "fetchTenantForm",
  });

  if (response?.error) throw new Error(response?.error);

  const rentForm = response.message!;

  return (
    <Box>
      <BoothRentForm rentForm={rentForm} />
    </Box>
  );
}

export default Page;
