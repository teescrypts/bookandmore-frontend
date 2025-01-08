"use server";

import apiRequest from "@/utils/api-request";
import {
  addAddonRequest,
  addAllowedCountryRequest,
  AddBlogImageResponse,
  addCommissionStaffRequest,
  addCouponRequest,
  addLocationRequest,
  addLocationResponse,
  addOpeningHourReqquest,
  AddProductImageResponse,
  addProductRequestt,
  addPromotionCodeRequest,
  addRegularStaffRequest,
  addRentFormRequest,
  addRentFormRequest2,
  addServiceRequest,
  addShippingOptionRequest,
  addSubscriptionRequest,
  bookingRequestData,
  calculateTaxResponse,
  changePasswordRequest,
  changePasswordResponse,
  checkAppointmentActionRequest,
  checkAppointmentActionResponse,
  confirmStockB4CheckoutReesponse,
  createSaleRequest,
  deleteOpeningHourReqquest,
  fetchAvailabilityResponse,
  FetchCustomerServiceResponse,
  fetchProductOrServiceResponse,
  fetchSettingsResponse,
  FetchUserResponse,
  fetchValidCouponResponse,
  fetchValidCouponServiceResponse,
  generalResponse,
  getStaffAppointmentsResponse,
  LoginRequest,
  LoginResponse,
  LoyaltyPointSettingsRequest,
  onBoardCommissionStaffRequest,
  onBoardRegularStaffRequest,
  publishBlogRequest,
  RegisterRequest,
  RegisterResponse,
  rentFormSubRequest,
  setUpSettingsRequest,
  SignupRequest,
  SignupResponse,
  UpdateFnameRequest,
  UpdateFnameResponse,
  updateLocationActiveRequest,
  updateOrderStatusRequest,
  updateServiceStatusRequest,
  updateTaxRegistrationRequest,
  updateTaxSettingsRequest,
  UploadAvatarResponse,
} from "./action-types";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession } from "@/utils/get-session";
import { revalidateTag } from "next/cache";
import { format, getDate, getMonth, getYear, parse, parseISO } from "date-fns";
import { removeEmpty } from "@/utils/remove-empty";
import { CouponType } from "../(dashboard)/(admin)/admin/marketing/discounts/page";
import { ShopDataResponse } from "../(pages)/demo/barber/shop/[branch]/page";
import { success } from "@/theme/colors";
import { ProductPos } from "../(dashboard)/(admin)/admin/e-commerce/pos/page";

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export async function signup(
  prevState: { error?: string } | null | undefined,
  formData: FormData
) {
  if (formData.get("cPassword") !== formData.get("password")) {
    return { error: "Password does not match" };
  }

  const data = {
    fname: formData.get("fname"),
    lname: formData.get("lname"),
    email: formData.get("email"),
    password: formData.get("password"),
    ...(formData.get("referralCode") && {
      referralCode: formData.get("referralCode"),
    }),
  };

  const response = await apiRequest<SignupResponse, SignupRequest>(
    "/api/users/signup",
    {
      method: "POST",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  }

  if (response?.message && response?.token) {
    const cookieStore = cookies();
    cookieStore.set({
      name: "session",
      value: response.token,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: ONE_WEEK_IN_SECONDS,
    });

    redirect("/demo/barber/dashboard/profile");
  }
}

export async function registerAdmin(formData: FormData) {
  const rawFormData = {
    email: formData.get("email"),
  };

  const response = await apiRequest<RegisterResponse, RegisterRequest>(
    "/api/register",
    {
      method: "POST",
      data: { email: rawFormData.email },
    }
  );

  if (response.message && response.token) {
    const cookieStore = cookies();
    cookieStore.set({
      name: "session",
      value: response.token,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: ONE_WEEK_IN_SECONDS,
    });

    redirect("/admin/home");
  }
}

export async function fetchUserData() {
  const session = await getSession();

  if (!session) {
    return "session expired";
  }

  const response = await apiRequest<FetchUserResponse>("/api/users-data", {
    token: session,
    tag: "fetchUserData",
  });

  if (response.error) {
    return { error: response.error };
  } else {
    return { success: response.message };
  }
}

export async function uploadAvatar(formData: FormData) {
  const session = await getSession();
  const response = await apiRequest<UploadAvatarResponse, FormData>(
    "/api/users/me/avatar",
    {
      method: "POST",
      token: session,
      contentType: "multipart/form-data",
      data: formData,
    }
  );

  if (response.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchUser");
    revalidateTag("fetchCustomer");
    return;
  }
}

export async function updateInfo(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const data = {
    fname: formData.get("fname"),
    lname: formData.get("lname"),
    email: formData.get("email"),
  };

  const session = await getSession();
  const response = await apiRequest<UpdateFnameResponse, UpdateFnameRequest>(
    "/api/users/me",
    {
      method: "PATCH",
      token: session,
      data,
    }
  );

  if (response.error) {
    return { error: "error" };
  } else {
    return { success: "success" };
  }
}

export async function changePassword(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const oldPassword = formData.get("oldPassword");
  const newPassword = formData.get("newPassword");
  const cNewPassword = formData.get("cNewPassword");

  if (newPassword !== cNewPassword) {
    return { error: "incorrect password" };
  }

  const session = await getSession();
  const response = await apiRequest<
    changePasswordResponse,
    changePasswordRequest
  >("/api/users/me/password", {
    method: "PATCH",
    token: session,
    data: {
      password: oldPassword,
      newPassword,
    },
  });

  if (response.error) {
    return { error: "error" };
  } else {
    return { success: "success" };
  }
}

export async function addLocation(prevState: {}, formData: FormData) {
  const data = {
    name: formData.get("name"),
    address: {
      line1: formData.get("line1"),
      ...(formData.get("line2") && { line2: formData.get("line2") }),
      country: {
        countryName: formData.get("countryName"),
        countryCode: formData.get("countryCode"),
      },
      state: {
        stateName: formData.get("stateName"),
        stateCode: formData.get("stateCode"),
      },
      city: {
        cityName: formData.get("cityName"),
        cityCode: formData.get("cityCode"),
      },
      postalCode: formData.get("postalCode"),
    },
    timeZone: formData.get("timeZone"),
  };

  const session = await getSession();
  const response = await apiRequest<addLocationResponse, addLocationRequest>(
    "/api/locations",
    {
      token: session,
      method: "POST",
      data,
    }
  );

  if (response.error) {
    return { error: "error" };
  } else {
    revalidateTag("fetchLocations");
    revalidateTag("fetchUserData");
    revalidateTag("fetchCustomerBranches");
    return { success: "success" };
  }
}

export async function updateLocation(name: string, value: boolean, id: string) {
  const data = {
    [name]: value,
  };

  const session = await getSession();
  const response = await apiRequest<
    generalResponse,
    updateLocationActiveRequest
  >(`/api/locations/${id}`, {
    token: session,
    method: "PATCH",
    data,
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchLocations");
    revalidateTag("fetchUserData");
    return { success: response.message };
  }
}

export async function updateBranch(prevState: {}, formData: FormData) {
  const data = {
    name: formData.get("name"),
    address: {
      line1: formData.get("line1"),
      ...(formData.get("line2") && { line2: formData.get("line2") }),
      country: {
        countryName: formData.get("countryName"),
        countryCode: formData.get("countryCode"),
      },
      state: {
        stateName: formData.get("stateName"),
        stateCode: formData.get("stateCode"),
      },
      city: {
        cityName: formData.get("cityName"),
        cityCode: formData.get("cityCode"),
      },
      postalCode: formData.get("postalCode"),
    },
    timeZone: formData.get("timeZone"),
  };

  const id = formData.get("id");

  const session = await getSession();
  const response = await apiRequest<generalResponse, addLocationRequest>(
    `/api/locations/${id}/name-address`,
    {
      token: session,
      method: "PATCH",
      data,
    }
  );

  if (response.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchLocations");
    revalidateTag("fetchUserData");
    revalidateTag("fetchCustomerBranches");
    return { success: "success" };
  }
}

export async function updateTaxSettings(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  if (!formData.get("head_office")) {
    return { error: "Please select a branch as head office" };
  }

  const data = {
    taxBehavior: formData.get("tax_behavior"),
    branch: formData.get("head_office"),
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, updateTaxSettingsRequest>(
    "/api/taxes/stripe/settings",
    {
      token: session,
      method: "POST",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchDashboardTax");
    revalidateTag("fetchHomepageData");
    return { success: "success" };
  }
}

export async function uploadTaxRegistration(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  // const data = {
  //   country: formData.get("countryCode"),
  //   state: formData.get("stateCode"),
  //   type: formData.get("type"),
  //   ...(formData.get("date") && { activeFrom: formData.get("date") }),
  // };

  // const session = await getSession();
  // const response = await apiRequest<
  //   generalResponse,
  //   updateTaxRegistrationRequest
  // >("/api/taxes/stripe/registrations", {
  //   token: session,
  //   method: "POST",
  //   data,
  // });

  return { error: "Sorry, Adding registration is not avaialable in demo" };

  // if (response?.error) {
  //   return { error: response.error };
  // } else {
  //   return { success: "success" };
  // }
}

export async function addSubscription(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const data = {
    name: formData.get("name"),
    amount: formData.get("amount"),
    interval: formData.get("interval"),
    description: formData.get("description"),
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, addSubscriptionRequest>(
    `/api/subscriptions`,
    {
      token: session,
      method: "POST",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchSubscriptions");
    return { success: "success" };
  }
}

export async function updateSubscription(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const data = {
    name: formData.get("name"),
    description: formData.get("description"),
  };

  const id = formData.get("id");

  const session = await getSession();
  const response = await apiRequest<generalResponse, addSubscriptionRequest>(
    `/api/subscriptions/${id}`,
    { token: session, method: "PATCH", data }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: "success" };
  }
}

export async function deleteSubscription(id: string) {
  const session = await getSession();
  const response = await apiRequest<generalResponse>(
    `/api/subscriptions/${id}`,
    {
      token: session,
      method: "DELETE",
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchSubscriptions");
    return { success: "success" };
  }
}

export async function addSubscriptionRentForm(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const data = {
    category: formData.get("category"),
    subscription: formData.get("subscription"),
    tenantInfo: {
      fname: formData.get("fname"),
      lname: formData.get("lname"),
      email: formData.get("email"),
    },
    note: formData.get("note"),
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, addRentFormRequest>(
    "/api/rent-forms",
    {
      token: session,
      method: "POST",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: "success" };
  }
}

export async function addOneTimeRentForm(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const data = {
    category: formData.get("category"),
    oneTimePay: {
      price: formData.get("price"),
      duration: formData.get("duration"),
      startDate: formData.get("startDate"),
    },
    tenantInfo: {
      fname: formData.get("fname"),
      lname: formData.get("lname"),
      email: formData.get("email"),
    },
    note: formData.get("note"),
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, addRentFormRequest2>(
    "/api/rent-forms",
    {
      token: session,
      method: "POST",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: "success" };
  }
}

export async function deleteRentForm(id: string) {
  const session = await getSession();
  const response = await apiRequest<generalResponse>(`/api/rent-forms/${id}`, {
    token: session,
    method: "DELETE",
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchRentForms");
    revalidateTag("fetchTenantForm");
    return { success: "success" };
  }
}

export async function rentFormSubscriptionPay(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  if (formData.get("password") !== formData.get("cPassword")) {
    return { error: "Passwords do not match" };
  }

  const data = {
    password: formData.get("password"),
    price: formData.get("price"),
    formId: formData.get("id"),
    fname: formData.get("fname"),
    lname: formData.get("lname"),
    email: formData.get("email"),
    interval: Number(formData.get("interval")),
    admin: formData.get("admin"),
    branch: formData.get("branch"),
  };

  const response = await apiRequest<generalResponse, rentFormSubRequest>(
    "/api/checkout/subscription",
    {
      method: "POST",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: response.message };
  }
}

export async function login(
  prevState:
    | {
        error: string;
        types:
          | { type: string; branch: { name: string; id: string } }[]
          | undefined;
      }
    | { error: string; types?: undefined }
    | null
    | undefined,
  formData: FormData
) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
    ...(formData.get("type") && { type: formData.get("type") }),
  };

  const response = await apiRequest<LoginResponse, LoginRequest>(
    "/api/users/login",
    {
      method: "POST",
      data,
    }
  );

  if (response?.token) {
    const cookieStore = cookies();
    cookieStore.set({
      name: "session",
      value: response.token,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: ONE_WEEK_IN_SECONDS,
    });

    switch (response.type!) {
      case "tenant":
        redirect("/tenant/account");
        break;

      case "staff":
        redirect("/staff/account");
        break;

      case "admin":
        redirect("/admin/home");
        break;

      default:
        break;
    }

    return;
  }

  if (response?.message) {
    return { error: response!.message, types: response!.types };
  }

  if (response?.error) {
    return { error: response.error };
  }
}

export async function manageBilling(action: string) {
  const session = await getSession();
  const response = await apiRequest<generalResponse>(
    `/api/billings?action=${action}`,
    {
      token: session,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    redirect(response.message!);
  }
}

export async function addCommissionStaffForm(
  services: string[],
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const parsedDate = parseISO(formData.get("dob") as string);

  const year = getYear(parsedDate);
  const month = getMonth(parsedDate) + 1;
  const day = getDate(parsedDate);

  const commissionString = formData.get("commission") as string;
  const commission = parseFloat(commissionString);

  if (isNaN(commission) || commission < 1 || commission > 100) {
    return { error: "Commission must be a number between 1 and 100." };
  }

  const convertToBoolean = (value: FormDataEntryValue | null) => value === "on";

  const data = {
    fname: formData.get("fname"),
    lname: formData.get("lname"),
    email: formData.get("email"),
    dob: {
      day,
      month,
      year,
    },
    category: "commission" as const,

    commissionSettings: {
      commission,
    },

    services,
    permissions: {
      locations: convertToBoolean(formData.get("locations")),
      tax: convertToBoolean(formData.get("tax")),
      customers: convertToBoolean(formData.get("customers")),
      staffs: convertToBoolean(formData.get("staffs")),
      services: convertToBoolean(formData.get("services")),
      settings: convertToBoolean(formData.get("settings")),
      rent: convertToBoolean(formData.get("rent")),
      products: convertToBoolean(formData.get("products")),
      pos: convertToBoolean(formData.get("pos")),
      orders: convertToBoolean(formData.get("orders")),
      shipping: convertToBoolean(formData.get("shipping")),
      openingHours: convertToBoolean(formData.get("allowBooking")),
      calendar: convertToBoolean(formData.get("allowBooking")),
      blog: convertToBoolean(formData.get("blog")),
      marketing: convertToBoolean(formData.get("marketing")),
    },
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, addCommissionStaffRequest>(
    "/api/staff-forms",
    {
      method: "POST",
      token: session,
      data,
    }
  );

  if (response?.error) {
    return {
      error: response.error,
    };
  } else {
    revalidateTag("fetchStaffPendingForm");
    revalidateTag("fetchStaffForm");
    return {
      success: response.message,
    };
  }
}

export async function addRegularStaffForm(
  services: string[],
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const parsedDate = parseISO(formData.get("dob") as string);

  const year = getYear(parsedDate);
  const month = getMonth(parsedDate) + 1;
  const day = getDate(parsedDate);

  const convertToBoolean = (value: FormDataEntryValue | null) => value === "on";

  const data = {
    fname: formData.get("fname"),
    lname: formData.get("lname"),
    email: formData.get("email"),
    dob: {
      day,
      month,
      year,
    },
    category: "regular" as const,

    regularSettings: {
      allowBooking: convertToBoolean(formData.get("allowBooking")),
      presetTimeAndService: convertToBoolean(
        formData.get("presetTimeAndService")
      ),
    },
    services,
    permissions: {
      locations: convertToBoolean(formData.get("locations")),
      tax: convertToBoolean(formData.get("tax")),
      customers: convertToBoolean(formData.get("customers")),
      staffs: convertToBoolean(formData.get("staffs")),
      services: convertToBoolean(formData.get("services")),
      settings: convertToBoolean(formData.get("settings")),
      rent: convertToBoolean(formData.get("rent")),
      products: convertToBoolean(formData.get("products")),
      pos: convertToBoolean(formData.get("pos")),
      orders: convertToBoolean(formData.get("orders")),
      shipping: convertToBoolean(formData.get("shipping")),
      openingHours: convertToBoolean(formData.get("allowBooking")),
      calendar: convertToBoolean(formData.get("allowBooking")),
      blog: convertToBoolean(formData.get("blog")),
      marketing: convertToBoolean(formData.get("marketing")),
    },
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, addRegularStaffRequest>(
    "/api/staff-forms",
    {
      method: "POST",
      token: session,
      data,
    }
  );

  if (response?.error) {
    return {
      error: response.error,
    };
  } else {
    revalidateTag("fetchStaffPendingForm");
    revalidateTag("fetchStaffForm");
    return {
      success: response.message,
    };
  }
}

export async function deleteStaffForm(id: string) {
  const session = await getSession();
  const response = await apiRequest<generalResponse>(`/api/staff-forms/${id}`, {
    token: session,
    method: "DELETE",
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchStaffPendingForm");
    revalidateTag("fetchStaffForm");
    return { success: "success" };
  }
}

export async function onboardCommissionStaff(
  services: string[],
  prevState: { error?: string } | null,
  formData: FormData
) {
  if (formData.get("password") !== formData.get("cPassword")) {
    return { error: "Passwords do not match" };
  }

  const parsedDate = parseISO(formData.get("dob") as string);

  const year = getYear(parsedDate);
  const month = getMonth(parsedDate) + 1;
  const day = getDate(parsedDate);

  const convertToBoolean = (value: FormDataEntryValue | null) => value === "on";

  const data = {
    admin: formData.get("admin"),
    branch: formData.get("branch"),
    formId: formData.get("formId"),
    fname: formData.get("fname"),
    lname: formData.get("lname"),
    email: formData.get("email"),
    dob: {
      day,
      month,
      year,
    },
    commission: Number(formData.get("commission")),
    services,
    permissions: {
      locations: convertToBoolean(formData.get("locations")),
      tax: convertToBoolean(formData.get("tax")),
      customers: convertToBoolean(formData.get("customers")),
      staffs: convertToBoolean(formData.get("staffs")),
      services: convertToBoolean(formData.get("services")),
      settings: convertToBoolean(formData.get("settings")),
      rent: convertToBoolean(formData.get("rent")),
      products: convertToBoolean(formData.get("products")),
      pos: convertToBoolean(formData.get("pos")),
      orders: convertToBoolean(formData.get("orders")),
      shipping: convertToBoolean(formData.get("shipping")),
      openingHours: true,
      calendar: true,
      blog: convertToBoolean(formData.get("blog")),
      marketing: convertToBoolean(formData.get("marketing")),
    },
    password: formData.get("password"),
  };

  const response = await apiRequest<
    generalResponse,
    onBoardCommissionStaffRequest
  >("/api/staff-onboarding/commission", {
    method: "POST",
    data,
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchStaffForm");
    revalidateTag("fetchStaffForService");
    revalidateTag("fetchAServiceAndStaff");
    redirect(`/register/stripe-account?connectedAccountId=${response.message}`);
  }
}

export async function onboardRegularStaff(
  services: string[],
  prevState: { error?: string } | null,
  formData: FormData
) {
  if (formData.get("password") !== formData.get("cPassword")) {
    return { error: "Passwords do not match" };
  }

  const parsedDate = parseISO(formData.get("dob") as string);

  const year = getYear(parsedDate);
  const month = getMonth(parsedDate) + 1;
  const day = getDate(parsedDate);

  const convertToBoolean = (value: FormDataEntryValue | null) => value === "on";

  const data = {
    admin: formData.get("admin"),
    branch: formData.get("branch"),
    formId: formData.get("formId"),
    fname: formData.get("fname"),
    lname: formData.get("lname"),
    email: formData.get("email"),
    dob: {
      day,
      month,
      year,
    },

    services,
    permissions: {
      locations: convertToBoolean(formData.get("locations")),
      tax: convertToBoolean(formData.get("tax")),
      customers: convertToBoolean(formData.get("customers")),
      staffs: convertToBoolean(formData.get("staffs")),
      services: convertToBoolean(formData.get("services")),
      settings: convertToBoolean(formData.get("settings")),
      rent: convertToBoolean(formData.get("rent")),
      products: convertToBoolean(formData.get("products")),
      pos: convertToBoolean(formData.get("pos")),
      orders: convertToBoolean(formData.get("orders")),
      shipping: convertToBoolean(formData.get("shipping")),
      openingHours: convertToBoolean(formData.get("allowBooking")),
      calendar: convertToBoolean(formData.get("allowBooking")),
      blog: convertToBoolean(formData.get("blog")),
      marketing: convertToBoolean(formData.get("marketing")),
    },
    password: formData.get("password"),
  };

  const response = await apiRequest<
    generalResponse,
    onBoardRegularStaffRequest
  >("/api/staff-onboarding/regular", {
    method: "POST",
    data,
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchStaffForm");
    revalidateTag("fetchStaffForService");
    revalidateTag("fetchAServiceAndStaff");
    redirect(
      "/demo/login?fromOnboarding=Your onboarding is complete! Please log in to your dashboard to get started"
    );
  }
}

export async function fetchAccountId(connectedAccountId: string) {
  const response = await apiRequest<generalResponse, { account: string }>(
    "/api/staff-onboarding/account-session",
    {
      method: "POST",
      data: { account: connectedAccountId },
    }
  );

  if (response?.error) {
    throw new Error(response.error);
  }

  revalidateTag("fetchStaffForm");
  return response.message!;
}

export async function updateAvailability(
  availability: "available" | "unavailable"
) {
  const session = await getSession();
  const response = await apiRequest<
    generalResponse,
    { availability: "available" | "unavailable" }
  >("/api/opening-hours", {
    token: session,
    method: "PATCH",
    data: { availability },
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchOpeningHours");
    return { success: response.message };
  }
}

export async function addOpeningHours(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const from = formData.get("from") as string;
  const to = formData.get("to") as string;

  const parsedFrom = parse(from, "hh:mm a", new Date());
  const parsedTo = parse(to, "hh:mm a", new Date());

  const data = {
    day: formData.get("day"),
    timeSlot: {
      from: format(parsedFrom, "HH:mm"),
      to: format(parsedTo, "HH:mm"),
    },
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, addOpeningHourReqquest>(
    "/api/opening-hours",
    {
      token: session,
      method: "POST",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchOpeningHours");
    return { success: response.message };
  }
}

export async function deleteTimeSlot(
  day: string,
  timeSlot: {
    from: string;
    to: string;
  }
) {
  const data = {
    day,
    timeSlot,
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, deleteOpeningHourReqquest>(
    "/api/opening-hours",
    {
      token: session,
      method: "DELETE",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchOpeningHours");
    return { success: response.message };
  }
}

export async function addService(
  staffs: string[],
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const estimatedHours = Number(formData.get("estimatedHours")) || 0;
  const estimatedMinutes = Number(formData.get("estimatedMinutes")) || 0;
  const bufferHours = Number(formData.get("bufferHours")) || 0;
  const bufferMinutes = Number(formData.get("bufferMinutes")) || 0;

  if (estimatedMinutes === 0) {
    return {
      error: "You must set at least the estimated minutes for the service.",
    };
  }

  const data = {
    name: formData.get("name"),
    category: {
      name: formData.get("categoryName"),
      taxCode: formData.get("categoryTaxCode"),
    },
    description: formData.get("description"),
    color: formData.get("color"),
    priceAmount: Number(formData.get("priceAmount")),
    estimatedTime: {
      hours: estimatedHours,
      minutes: estimatedMinutes,
    },
    bufferTime: {
      hours: bufferHours,
      minutes: bufferMinutes,
    },
    staffs,
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, addServiceRequest>(
    "/api/services",
    {
      token: session,
      method: "POST",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchServices");
    revalidateTag("fetchServicesForRentForm");
    revalidateTag("fetchCustomerServices");
    return { success: "Service added successfully." };
  }
}

export async function deleteService(id: string) {
  const session = await getSession();
  const response = await apiRequest<generalResponse>(`/api/services/${id}`, {
    token: session,
    method: "DELETE",
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchServices");
    revalidateTag("fetchServicesForRentForm");
    return { success: response.message };
  }
}

export async function updateService(
  staffs: string[],
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const estimatedHours = Number(formData.get("estimatedHours")) || 0;
  const estimatedMinutes = Number(formData.get("estimatedMinutes")) || 0;
  const bufferHours = Number(formData.get("bufferHours")) || 0;
  const bufferMinutes = Number(formData.get("bufferMinutes")) || 0;

  if (estimatedMinutes === 0) {
    return {
      error: "You must set at least the estimated minutes for the service.",
    };
  }

  const data = {
    name: formData.get("name"),
    category: {
      name: formData.get("categoryName"),
      taxCode: formData.get("categoryTaxCode"),
    },
    description: formData.get("description"),
    color: formData.get("color"),
    // priceType: formData.get("priceType"),
    priceAmount: Number(formData.get("priceAmount")),
    estimatedTime: {
      hours: estimatedHours,
      minutes: estimatedMinutes,
    },
    bufferTime: {
      hours: bufferHours,
      minutes: bufferMinutes,
    },
    staffs,
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, addServiceRequest>(
    `/api/services/${formData.get("id")}`,
    {
      token: session,
      method: "PATCH",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchServicesForRentForm");
    revalidateTag("fetchCustomerServices");
    return {
      success: response.message,
    };
  }
}

export async function updateServiceStatus(
  id: string,
  status: "active" | "paused"
) {
  const data = { status };

  const session = await getSession();
  const response = await apiRequest<
    generalResponse,
    updateServiceStatusRequest
  >(`/api/services/${id}`, {
    method: "PATCH",
    token: session,
    data,
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchServices");
    return { success: response.message };
  }
}

export async function fetchProductOrService(type: string) {
  const session = await getSession();
  const response = await apiRequest<fetchProductOrServiceResponse>(
    `/api/services/addon/manager?type=${type}`,
    {
      token: session,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: response.message };
  }
}

export async function addAddon(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const convertToBoolean = (value: FormDataEntryValue | null) => value === "on";

  if (formData.get("serviceId") === formData.get("selectedAddon")) {
    return { error: "A service cannot be added as its own addon." };
  }

  const data = {
    ...(formData.get("type") === "service" && {
      addonService: formData.get("selectedAddon"),
    }),
    ...(formData.get("type") === "product" && {
      addonProduct: formData.get("selectedAddon"),
    }),
    service: formData.get("serviceId"),
    type: formData.get("type"),
    free: convertToBoolean(formData.get("free")),
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, addAddonRequest>(
    "/api/services/addon/manager",
    {
      token: session,
      method: "POST",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchAService");
    return { success: response.message };
  }
}

export async function deleteAddon(id: string) {
  const session = await getSession();
  const response = await apiRequest<generalResponse>(
    `/api/services/addon/manager/${id}`,
    {
      token: session,
      method: "DELETE",
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchAService");
    return { success: response.message };
  }
}

export async function setUpSettings(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const convertToBoolean = (value: FormDataEntryValue | null) => value === "on";

  // Determine fee types
  let feeTypeForCancel;
  if (formData.get("fixedTypeCancel")) {
    feeTypeForCancel = "fixed";
  } else if (formData.get("percentTypeCancel")) {
    feeTypeForCancel = "percent";
  }

  let feeTypeForNoshow;
  if (formData.get("fixedTypeNoshow")) {
    feeTypeForNoshow = "fixed";
  } else if (formData.get("percentTypeNoshow")) {
    feeTypeForNoshow = "percent";
  }

  // Collect cancel and no-show fee toggles
  const collectCancelFee = convertToBoolean(formData.get("collectCancelFee"));
  const collectNoshowFee = convertToBoolean(formData.get("collectNoshowFee"));

  // Validation
  if (collectCancelFee && !feeTypeForCancel) {
    return {
      error: "Please select a cancellation fee type.",
    };
  }
  if (collectNoshowFee && !feeTypeForNoshow) {
    return {
      error: "Please select a no-show fee type.",
    };
  }

  // Build data object
  const data = {
    policy: {
      collectCancelFee,
      ...(feeTypeForCancel && { feeTypeForCancel }),
      ...(formData.get("cancelFeeValuePercent") && {
        cancelFeeValue: Number(formData.get("cancelFeeValuePercent")),
      }),
      ...(formData.get("cancelFeeValueFixed") && {
        cancelFeeValue: Number(formData.get("cancelFeeValueFixed")),
      }),
      ...(formData.get("cancellationNotice") && {
        cancellationNotice: Number(formData.get("cancellationNotice")),
      }),

      collectNoshowFee,
      ...(feeTypeForNoshow && { feeTypeForNoshow }),
      ...(formData.get("noshowFeeValuePercent") && {
        noshowFeeValue: Number(formData.get("noshowFeeValuePercent")),
      }),
      ...(formData.get("noshowFeeValueFixed") && {
        noshowFeeValue: Number(formData.get("noshowFeeValueFixed")),
      }),
    },

    leadTime: Number(formData.get("leadTime")),
    bookingWindow: Number(formData.get("bookingWindow")),
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, setUpSettingsRequest>(
    "/api/booking-settings",
    {
      token: session,
      method: "POST",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchCustomerBookingSettings");
    revalidateTag("fetchBookingSettings");
    return { success: response.message };
  }
}

export async function updateSettings(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const convertToBoolean = (value: FormDataEntryValue | null) => value === "on";

  // Determine fee types
  let feeTypeForCancel;
  if (formData.get("fixedTypeCancel")) {
    feeTypeForCancel = "fixed";
  } else if (formData.get("percentTypeCancel")) {
    feeTypeForCancel = "percent";
  }

  let feeTypeForNoshow;
  if (formData.get("fixedTypeNoshow")) {
    feeTypeForNoshow = "fixed";
  } else if (formData.get("percentTypeNoshow")) {
    feeTypeForNoshow = "percent";
  }

  // Collect cancel and no-show fee toggles
  const collectCancelFee = convertToBoolean(formData.get("collectCancelFee"));
  const collectNoshowFee = convertToBoolean(formData.get("collectNoshowFee"));

  // Validation
  if (collectCancelFee && !feeTypeForCancel) {
    return {
      error: "Please select a cancellation fee type.",
    };
  }
  if (collectNoshowFee && !feeTypeForNoshow) {
    return {
      error: "Please select a no-show fee type.",
    };
  }

  // Build data object
  const data = {
    policy: {
      collectCancelFee,
      ...(feeTypeForCancel && { feeTypeForCancel }),
      ...(formData.get("cancelFeeValuePercent") && {
        cancelFeeValue: Number(formData.get("cancelFeeValuePercent")),
      }),
      ...(formData.get("cancelFeeValueFixed") && {
        cancelFeeValue: Number(formData.get("cancelFeeValueFixed")),
      }),
      ...(formData.get("cancellationNotice") && {
        cancellationNotice: Number(formData.get("cancellationNotice")),
      }),

      collectNoshowFee,
      ...(feeTypeForNoshow && { feeTypeForNoshow }),
      ...(formData.get("noshowFeeValuePercent") && {
        noshowFeeValue: Number(formData.get("noshowFeeValuePercent")),
      }),
      ...(formData.get("noshowFeeValueFixed") && {
        noshowFeeValue: Number(formData.get("noshowFeeValueFixed")),
      }),
    },

    leadTime: Number(formData.get("leadTime")),
    bookingWindow: Number(formData.get("bookingWindow")),
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, setUpSettingsRequest>(
    `/api/booking-settings/${formData.get("id")}`,
    {
      token: session,
      method: "PATCH",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchBookingSettings");
    revalidateTag("fetchCustomerBookingSettings");
    return { success: response.message };
  }
}

export async function addProduct(
  sizes: { sizeType: string | undefined; quantity: string | undefined }[],
  draftImages: { url: string; imageId: string; fileName: string }[],
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const convertToBoolean = (value: FormDataEntryValue | null) => value === "on";

  if (convertToBoolean(formData.get("sizeBased"))) {
    if (sizes.length === 0) {
      return { error: "Please add sizes and quantity" };
    }
  }

  if (draftImages.length === 0) {
    return { error: "Please add at least one product image" };
  }

  const rawData = {
    name: formData.get("name"),
    category: {
      name: formData.get("categoryName"),
      taxCode: formData.get("categoryTaxCode"),
    },
    description: formData.get("description"),
    price: Number(formData.get("price")),
    expiryDate: formData.get("expiryDate"),
    SKU: formData.get("SKU"),
    barcode: formData.get("barcode"),
    sizeBasedQuantity: {
      enabled: convertToBoolean(formData.get("sizeBased")),
      ...(convertToBoolean(formData.get("sizeBased")) && { details: sizes }),
    },
    quantity: Number(formData.get("quantity")),
    sellOnlyWithAppointment: convertToBoolean(
      formData.get("sellOnlyWithAppointment")
    ),
    images: draftImages,
  };

  const data = removeEmpty(rawData);

  const session = await getSession();
  const response = await apiRequest<generalResponse, addProductRequestt>(
    "/api/products",
    {
      token: session,
      method: "POST",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchProduct");
    revalidateTag("fetchProducts");
    revalidateTag("fetchDraftImages");
    revalidateTag("fetchShopData");
    revalidateTag("fetchHomepageData");
    revalidateTag("CustomerfetchProduct");
    revalidateTag("fetchCustomerBranches");
    return { success: response.message };
  }
}

export async function updateProduct(
  sizes: { sizeType: string | undefined; quantity: string | undefined }[],
  draftImages: { url: string; imageId: string; fileName: string }[],
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const convertToBoolean = (value: FormDataEntryValue | null) => value === "on";

  if (convertToBoolean(formData.get("sizeBased"))) {
    if (sizes.length === 0) {
      return { error: "Please add sizes and quantity" };
    }
  }

  if (draftImages.length === 0) {
    return { error: "Please add at least one product image" };
  }

  const rawData = {
    name: formData.get("name"),
    category: {
      name: formData.get("categoryName"),
      taxCode: formData.get("categoryTaxCode"),
    },
    description: formData.get("description"),
    price: Number(formData.get("price")),
    expiryDate: formData.get("expiryDate"),
    SKU: formData.get("SKU"),
    barcode: formData.get("barcode"),
    sizeBasedQuantity: {
      enabled: convertToBoolean(formData.get("sizeBased")),
      ...(convertToBoolean(formData.get("sizeBased")) && { details: sizes }),
    },
    quantity: convertToBoolean(formData.get("sizeBased"))
      ? 0
      : Number(formData.get("quantity")),
    sellOnlyWithAppointment: convertToBoolean(
      formData.get("sellOnlyWithAppointment")
    ),
    images: draftImages,
    discount: Number(formData.get("discount")),
  };

  const data = removeEmpty(rawData);

  const session = await getSession();
  const response = await apiRequest<generalResponse, addProductRequestt>(
    `/api/products/${formData.get("id")}`,
    {
      token: session,
      method: "PATCH",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchProduct");
    revalidateTag("fetchProducts");
    revalidateTag("fetchDraftImages");
    revalidateTag("fetchShopData");
    revalidateTag("fetchHomepageData");
    revalidateTag("CustomerfetchProduct");
    return { success: response.message };
  }
}

export async function deleteProduct(id: string) {
  const session = await getSession();
  const response = await apiRequest<generalResponse>(`/api/products/${id}`, {
    token: session,
    method: "DELETE",
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchProduct");
    revalidateTag("fetchProducts");
    revalidateTag("fetchDraftImages");
    revalidateTag("fetchHomepageData");
    revalidateTag("CustomerfetchProduct");
    return { success: response.message };
  }
}

export async function addProductImage(formData: FormData, productId?: string) {
  const session = await getSession();
  const url = productId
    ? `/api/products/single/image?product=${productId}`
    : "/api/products/single/image";

  const response = await apiRequest<AddProductImageResponse, FormData>(url, {
    method: "POST",
    token: session,
    contentType: "multipart/form-data",
    data: formData,
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchProduct");
    revalidateTag("fetchProducts");
    revalidateTag("fetchDraftImages");
    revalidateTag("fetchShopData");
    revalidateTag("fetchHomepageData");
    revalidateTag("CustomerfetchProduct");
    return { success: response.message };
  }
}

export async function deleteProductImage(id: string, productId?: string) {
  const session = await getSession();
  const url = productId
    ? `/api/products/${id}/image?product=${productId}`
    : `/api/products/${id}/image`;

  const response = await apiRequest<generalResponse>(url, {
    token: session,
    method: "DELETE",
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchProduct");
    revalidateTag("fetchProducts");
    revalidateTag("fetchDraftImages");
    revalidateTag("fetchShopData");
    revalidateTag("fetchHomepageData");
    revalidateTag("CustomerfetchProduct");
    return { success: response.message };
  }
}

export async function deleteAllProductImages() {
  const session = await getSession();
  const response = await apiRequest<generalResponse>(`/api/products/image`, {
    token: session,
    method: "DELETE",
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchProduct");
    revalidateTag("fetchProducts");
    revalidateTag("fetchDraftImages");
    revalidateTag("fetchShopData");
    revalidateTag("fetchHomepageData");
    revalidateTag("CustomerfetchProduct");
    return { success: response.message };
  }
}

export async function addShippingOption(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const data = {
    displayName: formData.get("displayName") as string | null,
    amount: Number(formData.get("amount")),
    minEstimate: Number(formData.get("minEstimate")),
    maxEstimate: Number(formData.get("maxEstimate")),
    unit:
      formData.get("unit") === "business day"
        ? "business_day"
        : (formData.get("unit") as string),
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, addShippingOptionRequest>(
    "/api/shipping-options",
    {
      token: session,
      method: "POST",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchShippingOptions");
    return { success: response.message };
  }
}

export async function updateShippingOption(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const data = {
    displayName: formData.get("displayName") as string | null,
    amount: Number(formData.get("amount")),
    minEstimate: Number(formData.get("minEstimate")),
    maxEstimate: Number(formData.get("maxEstimate")),
    unit:
      formData.get("unit") === "business day"
        ? "business_day"
        : (formData.get("unit") as string),
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, addShippingOptionRequest>(
    `/api/shipping-options/${formData.get("id")}`,
    {
      token: session,
      method: "PATCH",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchShippingOptions");
    return { success: response.message };
  }
}

export async function deleteShippingOption(id: string) {
  const session = await getSession();
  const response = await apiRequest<generalResponse>(
    `/api/shipping-options/${id}`,
    {
      token: session,
      method: "DELETE",
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchShippingOptions");
    return { success: response.message };
  }
}

export async function addAllowedCountry(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const data = {
    country: {
      name: formData.get("countryName"),
      isoCode: formData.get("countryCode"),
    },
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, addAllowedCountryRequest>(
    "/api/allowed-country",
    {
      token: session,
      method: "POST",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchShippingOptions");
    return { success: response.message };
  }
}

export async function deleteAllowedCountry(id: string) {
  const session = await getSession();
  const response = await apiRequest<generalResponse>(
    `/api/allowed-country/${id}`,
    {
      token: session,
      method: "DELETE",
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchShippingOptions");
    return { success: response.message };
  }
}

export async function uploadBlogImage(formData: FormData) {
  const session = await getSession();
  const response = await apiRequest<AddBlogImageResponse, FormData>(
    "/api/blogs/single/image",
    {
      method: "POST",
      token: session,
      contentType: "multipart/form-data",
      data: formData,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchHomepageData");
    revalidateTag("fetchBlogImageDraft");
    return { success: response.message };
  }
}

export async function deleteBlogDraftImage(id: string) {
  const session = await getSession();
  const response = await apiRequest<generalResponse>(`/api/blogs/${id}/image`, {
    token: session,
    method: "DELETE",
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchHomepageData");
    revalidateTag("fetchBlogImageDraft");
    return { success: response.message };
  }
}

export async function publishBlog(
  cover: { url: string; imageId: string; fileName: string } | null,
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  if (!cover) {
    return { error: "Please add a blog image" };
  }

  const data = {
    title: formData.get("title"),
    shortDescription: formData.get("shortDescription"),
    author: formData.get("author"),
    content: formData.get("content"),
    estReadTime: Number(formData.get("estReadTime")),
    coverImage: cover,
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, publishBlogRequest>(
    "/api/blogs",
    {
      token: session,
      method: "POST",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchHomepageData");
    revalidateTag("fetchBlogs");
    return { success: response.message };
  }
}

export async function deleteBlog(id: string) {
  const session = await getSession();
  const response = await apiRequest<generalResponse>(`/api/blogs/${id}`, {
    token: session,
    method: "DELETE",
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchHomepageData");
    revalidateTag("fetchBlogs");
    return { success: response.message };
  }
}

export async function updateBlog(
  cover: { url: string; imageId: string; fileName: string },
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const data = {
    title: formData.get("title"),
    shortDescription: formData.get("shortDescription"),
    author: formData.get("author"),
    content: formData.get("content"),
    estReadTime: Number(formData.get("estReadTime")),
    coverImage: cover,
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, publishBlogRequest>(
    `/api/blogs/${formData.get("id")}`,
    {
      token: session,
      method: "PATCH",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchHomepageData");
    revalidateTag("fetchBlogs");
    return { success: response.message };
  }
}

export async function addCoupon(
  addedProducts: { productId: string; stripeId: string }[],
  addedServices: { serviceId: string; stripeId: string }[],
  coupons: CouponType[],
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const serviceStripeIds = addedServices.map(
    (addedService) => addedService.stripeId
  );
  const productStripeIds = addedProducts.map(
    (addedProduct) => addedProduct.stripeId
  );

  const services = addedServices.map((addedService) => addedService.serviceId);
  const products = addedProducts.map((addedProduct) => addedProduct.productId);

  const appliesToProducts = [...serviceStripeIds, ...productStripeIds];

  if (coupons.length > 0) {
    const hasEmpty = coupons.some(
      (coupon) =>
        coupon.addedProducts.length === 0 && coupon.addedServices.length === 0
    );

    const isEmpty = services.length === 0 && products.length === 0;

    if (hasEmpty && isEmpty) {
      return {
        error:
          "You can only have one general coupon at a time. Please limit additional coupons to specific services or products.",
      };
    }

    const existingProducts = coupons.flatMap((coupon) =>
      coupon.addedProducts.map((product) => product._id)
    );
    const existingServices = coupons.flatMap((coupon) =>
      coupon.addedServices.map((service) => service._id)
    );

    const duplicateProducts = products.filter((product) =>
      existingProducts.includes(product)
    );

    const duplicateServices = services.filter((service) =>
      existingServices.includes(service)
    );

    if (duplicateProducts.length > 0 || duplicateServices.length > 0) {
      return {
        error: `Duplicate products or services detected. Each product can only have one coupon attached at a time`,
      };
    }
  }

  const data = {
    valueType:
      formData.get("valueType") === "percentage"
        ? "percent_off"
        : ("amount_off" as "percent_off" | "amount_off"),
    value: Number(formData.get("value")),
    maxRedemptions: Number(formData.get("maxRedemptions")),
    expiresAt: formData.get("expiresAt"),
    ...(appliesToProducts.length > 0 && {
      appliesTo: {
        products: appliesToProducts,
      },
    }),
    ...(addedProducts.length > 0 && { addedProducts: products }),
    ...(addedServices.length > 0 && { addedServices: services }),
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, addCouponRequest>(
    "/api/coupons",
    {
      token: session,
      method: "POST",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchCoupons");
    revalidateTag("fetchValidCoupon");
    revalidateTag("fetchShopData");
    return { success: response.message };
  }
}

export async function addPromotionCode(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const convertToBoolean = (value: FormDataEntryValue | null) => value === "on";

  const data = {
    coupon: formData.get("coupon"),
    stripeCouponId: formData.get("stripeId"),
    code: formData.get("code")!.toString().toUpperCase(),
    ...(Number(formData.get("maxRedemption")) > 0 && {
      maxRedemptions: Number(formData.get("maxRedemption")),
    }),
    restrictions: {
      firstTransactionOnly: convertToBoolean(
        formData.get("firstTransactionOnly")
      ),
      ...(Number(formData.get("minimumAmount")) > 0 && {
        minimumAmount: Number(formData.get("minimumAmount")),
      }),
    },
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, addPromotionCodeRequest>(
    "/api/promotion-codes",
    {
      token: session,
      method: "POST",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchCoupons");
    revalidateTag("fetchValidCoupon");
    revalidateTag("fetchShopData");
    return { success: response.message };
  }
}

export async function deleteCoupon(id: string) {
  const session = await getSession();
  const response = await apiRequest<generalResponse>(`/api/coupons/${id}`, {
    token: session,
    method: "DELETE",
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchCoupons");
    revalidateTag("fetchShopData");
    return { success: response.message };
  }
}

export async function updatePromotionCode(id: string, active: boolean) {
  const data = {
    active,
  };
  const session = await getSession();
  const response = await apiRequest<generalResponse, { active: boolean }>(
    `/api/promotion-codes/${id}`,
    {
      token: session,
      method: "PATCH",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchCoupons");
    revalidateTag("fetchValidCoupon");
    revalidateTag("fetchShopData");
    return { success: response.message };
  }
}

export async function addLoyaltyPointSettings(
  selectedProducts: string[],
  selectedServices: string[],
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const convertToBoolean = (value: FormDataEntryValue | null) => value === "on";

  const enableReferral = convertToBoolean(formData.get("enableReferral"));
  const enableAppointment = convertToBoolean(formData.get("enableAppointment"));
  const enableProduct = convertToBoolean(formData.get("enableProduct"));

  if (!enableReferral && !enableAppointment && !enableProduct) {
    return { error: "Please enable at least one way to earn a point" };
  }

  const data = {
    monetaryEquivalent: Number(formData.get("monetaryEquivalent")),
    enableReferral,
    minimumReferral: Number(formData.get("minimumReferral")),

    enableAppointment,
    minimumAmountEnabledApt: convertToBoolean(
      formData.get("minimumAmountEnabledApt")
    ),
    minimumAmountApt: Number(formData.get("minimumAmountApt")),
    appliesToApt: convertToBoolean(formData.get("appliesToApt")),
    aptServiceIds: selectedServices,

    enableProduct,
    minimumAmountEnabledProd: convertToBoolean(
      formData.get("minimumAmountEnabledProd")
    ),
    minimumAmountProd: Number(formData.get("minimumAmountProd")),
    appliesToProd: convertToBoolean(formData.get("appliesToProd")),
    prodServiceIds: selectedProducts,
  };

  const session = await getSession();
  const response = await apiRequest<
    generalResponse,
    LoyaltyPointSettingsRequest
  >("/api/loyalty-point-settings", {
    token: session,
    method: "POST",
    data,
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchLoyaltypointsSettings");
    revalidateTag("fetchShopData");
    // revalidateTag("fetchCustomerLoyaltyPoint")
    return { success: response.message };
  }
}

export async function updateLoyaltyPointSettings(
  selectedProducts: string[],
  selectedServices: string[],
  extProducts: string[],
  extServices: string[],
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const convertToBoolean = (value: FormDataEntryValue | null) => value === "on";

  const enableReferral = convertToBoolean(formData.get("enableReferral"));
  const enableAppointment = convertToBoolean(formData.get("enableAppointment"));
  const enableProduct = convertToBoolean(formData.get("enableProduct"));

  const appliesToApt = convertToBoolean(formData.get("appliesToApt"));
  const appliesToProd = convertToBoolean(formData.get("appliesToProd"));

  if (appliesToApt && selectedServices.concat(extServices).length === 0) {
    return {
      error:
        "Set a minimum of at least one service, or disable the service limit feature.",
    };
  }

  if (appliesToProd && selectedProducts.concat(extProducts).length === 0) {
    return {
      error:
        "Set a minimum of at least one product, or disable the product limit feature.",
    };
  }

  if (!enableReferral && !enableAppointment && !enableProduct) {
    return { error: "Please enable at least one way to earn a point" };
  }

  const data = {
    monetaryEquivalent: Number(formData.get("monetaryEquivalent")),
    enableReferral,
    minimumReferral: Number(formData.get("minimumReferral")),

    enableAppointment,
    minimumAmountEnabledApt: convertToBoolean(
      formData.get("minimumAmountEnabledApt")
    ),
    minimumAmountApt: Number(formData.get("minimumAmountApt")),
    appliesToApt,
    aptServiceIds: selectedServices.concat(extServices),

    enableProduct,
    minimumAmountEnabledProd: convertToBoolean(
      formData.get("minimumAmountEnabledProd")
    ),
    minimumAmountProd: Number(formData.get("minimumAmountProd")),
    appliesToProd,
    prodServiceIds: selectedProducts.concat(extProducts),
  };

  const session = await getSession();
  const response = await apiRequest<
    generalResponse,
    LoyaltyPointSettingsRequest
  >(`/api/loyalty-point-settings/${formData.get("id")}`, {
    token: session,
    method: "PATCH",
    data,
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchLoyaltypointsSettings");
    // revalidateTag("fetchCustomerLoyaltyPoint")
    return { success: response.message };
  }
}

export async function updateLoyaltyPointActive(id: string, active: boolean) {
  const session = await getSession();
  const response = await apiRequest<generalResponse, { active: boolean }>(
    `/api/loyalty-point-settings/${id}`,
    {
      token: session,
      method: "PATCH",
      data: { active },
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchLoyaltypointsSettings");
    return { success: response.message };
  }
}

interface Response {
  error?: string;
  message?: string;
}

export async function fetchConnectedAccountClientSecret() {
  const session = await getSession();
  const response = await apiRequest<Response>(
    "/api/users/staffs/account-session",
    {
      method: "POST",
      token: session,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    return { client_secret: response.message };
  }
}

export async function deleteStaffs(id: string) {
  const session = await getSession();
  const response = await apiRequest<generalResponse>(`/api/staff-infos/${id}`, {
    token: session,
    method: "DELETE",
  });

  if (response?.error) return { error: response.error };
  revalidateTag("fetchStaffInfo");
}

// ----------------------------- Customer Requests ----------------------------- //

export async function fetchServices(branch: string) {
  const response = await apiRequest<FetchCustomerServiceResponse>(
    `/api/bookings/fetch/services?branch=${branch}`,
    {
      tag: "fetchCustomerServices",
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: response.message };
  }
}

export async function fetchAvailability(
  branch: string,
  staff: string,
  serviceEstTime: { hours: number; minutes: number }
) {
  revalidateTag("testing");
  const response = await apiRequest<
    fetchAvailabilityResponse,
    {
      ownerId: string;
      branchId: string;
      estimatedServiceTime: { hours: number; minutes: number };
    }
  >("/api/bookings/fetch/available-slots", {
    method: "POST",
    data: {
      ownerId: staff,
      branchId: branch,
      estimatedServiceTime: serviceEstTime,
    },
    tag: "testing",
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: response.message };
  }
}

export async function fetchBookingSettings(location: string) {
  const response = await apiRequest<fetchSettingsResponse>(
    `/api/bookings/fetch/booking-settings?location=${location}`,
    { tag: "fetchCustomerBookingSettings" }
  );

  console.log(response);

  if (response?.error) {
    return {
      error: response.error,
    };
  } else {
    return { success: response.message };
  }
}

export async function bookAppointment(bookingData: bookingRequestData) {
  const session = await getSession();
  const response = await apiRequest<generalResponse, bookingRequestData>(
    "/api/bookings",
    {
      method: "POST",
      token: session,
      data: bookingData,
    }
  );

  console.log(response);

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: response.message };
  }
}

export async function fetchCustomerSecret(bookingData: bookingRequestData) {
  const session = await getSession();
  const response = await apiRequest<
    { error?: string; clientSecret?: string },
    bookingRequestData
  >("/api/checkout/setup-intent", {
    token: session,
    method: "POST",
    data: bookingData,
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    return response.clientSecret;
  }
}

export async function filterProducts(data: { [key: string]: string }) {
  try {
    const [key, value] = Object.entries(data)[0];

    const queryString = `${encodeURIComponent(key)}=${encodeURIComponent(
      value
    )}`;

    const response = await apiRequest<ShopDataResponse>(
      `/api/shop/fetch/shop-data?${queryString}`
    );

    if (response?.error) {
      return { error: response.error };
    } else {
      return { success: response.message };
    }
  } catch (error) {
    console.error("Error in filterProducts:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function addToCart(
  inStock: number,
  branch: string,
  productId: string,
  sizeBased: boolean,
  selectedSize?: string,
  quantity = 1
) {
  const session = await getSession();
  const response = await apiRequest<
    generalResponse,
    {
      productId: string;
      sizeBased: boolean;
      selectedSize?: string;
      branch: string;
      inStock: number;
      quantity: number;
    }
  >("/api/cart-items", {
    token: session,
    method: "POST",
    data: {
      productId,
      sizeBased,
      ...(selectedSize && sizeBased && { selectedSize }),
      branch,
      inStock,
      quantity,
    },
  });

  console.log(response);

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchCartItemCount");
    return { success: response.message };
  }
}

export async function mergeCart(
  product: string,
  quantity: {
    sizeBasedQuantity: { enabled: boolean; size: string };
    value: number;
  },
  branch: string
) {
  const session = await getSession();
  const response = await apiRequest<
    generalResponse,
    {
      product: string;
      quantity: {
        sizeBasedQuantity: { enabled: boolean; size: string };
        value: number;
      };
      branch: string;
    }
  >("/api/merge/cartItems", {
    token: session,
    method: "POST",
    data: { product, quantity, branch },
  });

  if (response?.error) {
    return { error: "Something went wrong. Please try again" };
  } else {
    revalidateTag("fetchCartItemCount");
    return { success: "success" };
  }
}

export async function fetchValidCoupons(branch: string) {
  const response = await apiRequest<fetchValidCouponResponse>(
    `/api/fetch/customer/coupons?branch=${branch}`,
    {
      tag: "fetchValidCoupon",
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: response.message };
  }
}

export async function deleteCartItem(item: string) {
  const session = await getSession();
  const response = await apiRequest<generalResponse>(
    `/api/cart-items/${item}`,
    { token: session, method: "DELETE" }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchCartItems");
    return { success: response.message };
  }
}

export async function updateQuantity(item: string, newQty: number) {
  const session = await getSession();
  const response = await apiRequest<generalResponse, { newQty: number }>(
    `/api/cart-items/${item}`,
    { token: session, method: "PATCH", data: { newQty } }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchCartItems");
    return { success: response.message };
  }
}

export async function getCartItemCountLoggedInUser(branch: string) {
  const session = await getSession();
  const response = await apiRequest<{ error?: string; message: number }>(
    `/api/count/cart-item?branch=${branch}`,
    {
      token: session,
      tag: "fetchCartItemCount",
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: response.message };
  }
}

export async function fetchClientSecretPayment(branch: string) {
  const session = await getSession();
  const response = await apiRequest<{ error?: string; clientSecret?: string }>(
    `/api/checkout/shop/payment?branch=${branch}`,
    {
      token: session,
      method: "POST",
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: response.clientSecret };
  }
}

export async function comfirmStockQty(
  product: string,
  newQty: number,
  size?: string
) {
  const response = await apiRequest<
    generalResponse,
    { product: string; size?: string; newQty: number }
  >("/api/confirm-stock-qty/cartItems", {
    method: "POST",
    data: { product, ...(size && { size }), newQty },
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: response.message! };
  }
}

export async function confirmStockB4Checkout(
  cartItems: { product: string; quantity: number; size?: string }[]
) {
  const response = await apiRequest<
    confirmStockB4CheckoutReesponse,
    { product: string; quantity: number; size?: string }[]
  >("/api/confirm-stock/checkout/cartItems", {
    method: "POST",
    data: cartItems,
  });

  if (response?.error) {
    revalidateTag("fetchCartItemCount");
    revalidateTag("fetchCartItems");
    revalidateTag("fetchShopData");

    if (response?.insufficientStockItems) {
      return {
        error: response.error,
        insufficientStockItems: response.insufficientStockItems,
      };
    } else {
      return { error: response.error };
    }
  } else {
    return { success: response.message };
  }
}

export async function checkAppointmentAction(
  data: checkAppointmentActionRequest
) {
  const session = await getSession();
  const response = await apiRequest<
    checkAppointmentActionResponse,
    checkAppointmentActionRequest
  >("/api/check-action/bookings", {
    token: session,
    method: "POST",
    data,
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: response.message };
  }
}

export async function cancelAppointment(
  charge: boolean,
  appointmentId: string,
  branch: string,
  bookedTime: string,
  bookedDate: string,
  collectFee: boolean,
  window?: number,
  amount?: number
) {
  const session = await getSession();
  const response = await apiRequest<
    generalResponse,
    {
      charge: boolean;
      amount?: number;
      branch: string;
      bookedTime: string;
      bookedDate: string;
      window?: number;
      collectFee: boolean;
    }
  >(`/api/booking/cancel/${appointmentId}`, {
    token: session,
    method: "POST",
    data: {
      charge,
      amount,
      branch,
      bookedTime,
      bookedDate,
      collectFee,
      window,
    },
  });

  if (response.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchCustomerAppointment");
    return { success: response.message };
  }
}

export async function fetchValidCouponService(service: string, branch: string) {
  const response = await apiRequest<fetchValidCouponServiceResponse>(
    `/api/bookings/fetch/validCoupons?addedServiceId=${service}&branch=${branch}`,
    {
      tag: `fetchValidCouponService`,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: response.message };
  }
}

export async function generateReferralCode() {
  const session = await getSession();
  const response = await apiRequest<generalResponse>(
    "/api/customer-info/generate-code",
    {
      token: session,
      method: "POST",
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchCustomerLoyaltyPoint");
    return { success: response.message };
  }
}

export async function calculateTax(
  branchId: string,
  amount: number,
  stripeProductId: string,
  name: string
) {
  const response = await apiRequest<
    calculateTaxResponse,
    { branchId: string; amount: number; stripeProductId: string; name: string }
  >("/api/tax/calculation/service", {
    method: "POST",
    data: { branchId, amount, stripeProductId, name },
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: response.message };
  }
}

export async function updateOrderStatus(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const data = {
    shippingAddress: {
      line1: formData.get("line1"),
      city: formData.get("city"),
      state: formData.get("state"),
      country: formData.get("country"),
      postal_code: formData.get("postal_code"),
    },
    status: formData.get("status"),
  };

  const session = await getSession();
  const response = await apiRequest<generalResponse, updateOrderStatusRequest>(
    `/api/orders/${formData.get("id")}`,
    { token: session, method: "PATCH", data }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetcgCustomerOrders");
    revalidateTag("fetchOrders");
    return { success: response.message };
  }
}

export async function calculateTaxForPos(
  data: {
    amount: number;
    stripeProductId: string;
    name: string;
    quantity: number;
  }[]
) {
  const session = await getSession();
  const response = await apiRequest<
    calculateTaxResponse,
    {
      cart: {
        amount: number;
        stripeProductId: string;
        name: string;
        quantity: number;
      }[];
    }
  >("/api/calculate/tax/pos", {
    token: session,
    method: "POST",
    data: { cart: data },
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: response.message };
  }
}

export async function searchPosProduct(searchQuery: string) {
  const session = await getSession();
  const response = await apiRequest<{ error?: string; message?: ProductPos[] }>(
    `/api/pos/search?searchQuery=${searchQuery}`,
    { token: session }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: response.message };
  }
}

export async function createSale(data: createSaleRequest) {
  const session = await getSession();
  const response = await apiRequest<generalResponse, createSaleRequest>(
    "/api/pos/sale",
    {
      token: session,
      method: "POST",
      data,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchPosData");
    return { success: response.message };
  }
}

export async function getStaffAppointments(startDate: string, endDate: string) {
  const session = await getSession();
  const response = await apiRequest<getStaffAppointmentsResponse>(
    `/api/calendar/get/appointments?startDate=${startDate}&endDate=${endDate}`,
    {
      token: session,
    }
  );

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: response.message };
  }
}

export async function applyCoupon(
  code: string,
  amount: number,
  branch: string,
  serviceId: string
) {
  const session = await getSession();
  const response = await apiRequest<
    {
      error?: string;
      message?: { discount: number; coupondId: string };
    },
    { code: string; amount: number; branch: string; serviceId: string }
  >("/api/bookings/validate/coupon-code", {
    token: session,
    method: "POST",
    data: { code, amount, branch, serviceId },
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: response.message };
  }
}

export async function payForAppointment(
  appointmentId: string,
  couponId?: string
) {
  const session = await getSession();
  const response = await apiRequest<
    { error?: string; clientSecret?: string },
    { appointmentId: string; couponId?: string }
  >("/api/checkout/appointment/payment", {
    token: session,
    method: "POST",
    data: { appointmentId, ...(couponId && { couponId }) },
  });

  if (response?.error) {
    return { error: response.error };
  } else {
    return { success: response.clientSecret };
  }
}

export async function redeemLoyaltyPoint() {
  const session = await getSession();
  const response = await apiRequest<generalResponse>(
    "/api/customer-info/redeem-loyalty-point",
    {
      token: session,
      method: "POST",
    }
  );

  if (response.error) {
    return { error: response.error };
  } else {
    revalidateTag("fetchCustomerLoyaltyPoint");
    return { success: response.message };
  }
}
