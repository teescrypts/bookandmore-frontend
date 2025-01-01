import React from "react";
import AccountManager from "../component/profile/account-manager";
import apiRequest from "@/utils/api-request";
import { getSession } from "@/utils/get-session";
import { API_BASE_URL } from "@/paths";

export interface ClientDataRaw {
  _id: string;
  fname: string;
  lname: string;
  email: string;
}

export interface ClientData extends ClientDataRaw {
  avatar: string;
}

interface Response {
  error?: string;
  message?: ClientDataRaw;
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/users", {
    token: session,
    tag: "fetchCustomer",
  });

  if (response?.error) throw new Error(response.error);

  const userDataRaw = response.message!;
  const user: ClientData = {
    ...userDataRaw,
    avatar: `${API_BASE_URL}/users/${userDataRaw._id}/avatar`,
  };

  return <AccountManager user={user} />;
}

export default Page;
