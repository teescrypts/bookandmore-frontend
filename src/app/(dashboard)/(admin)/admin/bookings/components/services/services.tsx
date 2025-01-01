import React from "react";
import apiRequest from "@/utils/api-request";
import { getSession } from "@/utils/get-session";
import ServiceList from "./service-list";
import NoActiveBranch from "@/components/no-active-branch";

interface Category {
  name: string;
  taxCode: string;
}

interface Time {
  hours?: number;
  minutes?: number;
}

export interface ServiceType {
  _id: string;
  name: string;
  category: Category;
  description?: string;
  color: string;
  priceAmount: number;
  estimatedTime?: Time;
  bufferTime?: Time;
  createdAt?: string;
  updatedAt?: string;
  status: "active" | "paused";
  staffs: string[];
}

interface Response {
  error?: string;
  message?: ServiceType[] | string;
}

async function Services() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/services", {
    token: session,
    tag: "fetchServices",
  });

  if (response?.error) throw new Error(response.error);

  if (typeof response.message === "string") {
    return <NoActiveBranch message={response.message} />;
  }

  const services = response.message!;

  return <ServiceList services={services} />;
}
export default Services;
