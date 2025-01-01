import apiRequest from "@/utils/api-request";
import React from "react";
import SuccessPage from "../components/success-page";
import { redirect } from "next/navigation";
import { CLIENT_BASE_URL } from "@/paths";

interface Message {
  status: string;
  payment_status: string;
  customer_email: string;
  formId: string;
}

interface Response {
  error?: string;
  message?: Message;
}

async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  if (!searchParams) throw new Error("Invalid Operation");

  const sessionId = searchParams.session_id;
  const response = await apiRequest<Response>(
    `/api/checkout?session_id=${sessionId}`,
    {
      tag: "sessionStatus",
    }
  );

  if (response?.error) throw new Error(response.error);

  const status = response.message!.status;

  if (status === "complete") {
    return <SuccessPage email={response.message!.customer_email} />;
  } else {
    redirect(`${CLIENT_BASE_URL}/register/${response.message!.formId}`);
  }
}

export default Page;
