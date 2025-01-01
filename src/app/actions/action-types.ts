import { DraftImage } from "../(dashboard)/(admin)/admin/e-commerce/products/add/page";

export interface generalResponse {
  message?: string;
  error?: string;
}

export interface AdminType {
  activeBranch?: {
    _id: string;
    name: string;
    opened: boolean;
  };
  type: "admin";
  id: string;
  name: string;
  email: string;
}

interface RentStatus {
  paymentStatus: string;
  status: string;
  stripeCustomer: string;
  dueOn: number;
}

export function isTenant(
  user: AdminType | TenantType | StaffType
): user is TenantType {
  return (user as TenantType).rentStatus !== undefined;
}

export function isStaff(
  user: AdminType | TenantType | StaffType
): user is StaffType {
  return (user as StaffType).permissions !== undefined;
}

export interface TenantType {
  activeBranch?: {
    _id: string;
    name: string;
    opened: boolean;
  };
  type: "admin";
  id: string;
  name: string;
  email: string;
  rentStatus: RentStatus;
}

export interface CustomerData {
  _id: string;
  name: string;
  type: string;
}

export interface StaffType {
  activeBranch?: {
    _id: string;
    name: string;
    opened: boolean;
  };
  type: "staff";
  id: string;
  name: string;
  email: string;
  permissions: { [key: string]: boolean };
}

export interface SignupRequest {
  fname: FormDataEntryValue | null;
  lname: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
  referralCode?: FormDataEntryValue | null;
}

export interface SignupResponse {
  error?: string;
  message?: string;
  token?: string;
}

export interface RegisterRequest {
  email: FormDataEntryValue | null;
}

export interface RegisterResponse {
  token?: string;
  message?: string;
  error?: string;
}

export interface FetchUserResponse {
  message?: AdminType | TenantType | CustomerData | StaffType;
  error?: string;
}

export interface UploadAvatarResponse {
  message?: string;
  error?: string;
}

export interface UpdateFnameRequest {
  fname: FormDataEntryValue | null;
}

export interface UpdateFnameResponse {
  message?: string;
  error?: string;
}

export interface changePasswordRequest {
  password: FormDataEntryValue | null;
  newPassword: FormDataEntryValue | null;
}

export interface changePasswordResponse {
  message?: string;
  error?: string;
}

export interface addLocationResponse {
  message?: string;
  error?: string;
}

export interface addLocationRequest {
  name: FormDataEntryValue | null;
  address: {
    country: {
      countryName: FormDataEntryValue | null;
      countryCode: FormDataEntryValue | null;
    };
    state: {
      stateName: FormDataEntryValue | null;
      stateCode: FormDataEntryValue | null;
    };
    city: {
      cityName: FormDataEntryValue | null;
      cityCode: FormDataEntryValue | null;
    };
    postalCode: FormDataEntryValue | null;
  };
  timeZone: FormDataEntryValue | null;
}

export interface updateLocationActiveRequest {
  [key: string]: boolean;
}

export interface updateTaxSettingsRequest {
  taxBehavior: FormDataEntryValue | null;
  branch: FormDataEntryValue | null;
}

export interface updateTaxRegistrationRequest {
  country: FormDataEntryValue | null;
  state: FormDataEntryValue | null;
  type: FormDataEntryValue | null;
  activeFrom?: FormDataEntryValue | null;
}

export interface addSubscriptionRequest {
  name: FormDataEntryValue | null;
  description?: FormDataEntryValue | null;
}

export interface addRentFormRequest {
  category: FormDataEntryValue | null;
  subscription: FormDataEntryValue | null;
  tenantInfo: {
    fname: FormDataEntryValue | null;
    lname: FormDataEntryValue | null;
    email: FormDataEntryValue | null;
  };
  note?: FormDataEntryValue | null;
}

export interface addRentFormRequest2 {
  category: FormDataEntryValue | null;
  oneTimePay: {
    price: FormDataEntryValue | null;
    duration: FormDataEntryValue | null;
    startDate: FormDataEntryValue | null;
  };
  tenantInfo: {
    fname: FormDataEntryValue | null;
    lname: FormDataEntryValue | null;
    email: FormDataEntryValue | null;
  };
  note?: FormDataEntryValue | null;
}

export interface rentFormSubRequest {
  password: FormDataEntryValue | null;
  price: FormDataEntryValue | null;
  formId: FormDataEntryValue | null;
  fname: FormDataEntryValue | null;
  lname: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  interval: FormDataEntryValue | null | number;
  admin: FormDataEntryValue | null;
  branch: FormDataEntryValue | null;
}

export interface LoginResponse {
  error?: string;
  message?: string;
  token?: string;
  type?: "tenant" | "admin" | "staff" | "customer";
  types?: { type: string; branch: { name: string; id: string } }[];
}

export interface LoginRequest {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
  type?: FormDataEntryValue | null;
}

export interface DOB {
  day: number;
  month: number;
  year: number;
}

export interface CommissionSettings {
  commission: number;
  // presetTimeAndService: boolean;
}

interface RegularSettings {
  allowBooking: boolean;
  presetTimeAndService: boolean;
}

export interface Permissions {
  locations: boolean;
  tax: boolean;
  customers: boolean;
  staffs: boolean;
  services: boolean;
  settings: boolean;
  rent: boolean;
  products: boolean;
  pos: boolean;
  orders: boolean;
  shipping: boolean;
  openingHours: boolean;
  calendar: boolean;
  blog: boolean;
  marketing: boolean;
}

export interface addCommissionStaffRequest {
  fname: string | FormDataEntryValue | null;
  lname: string | FormDataEntryValue | null;
  email: string | FormDataEntryValue | null;
  dob: DOB;
  category: "commission";
  commissionSettings: CommissionSettings;
  permissions: Permissions;
}

export interface addRegularStaffRequest {
  fname: FormDataEntryValue | null;
  lname: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  dob: DOB;
  category: "regular";
  regularSettings: RegularSettings;
  permissions: Permissions;
}

export interface onBoardCommissionStaffRequest {
  admin: FormDataEntryValue | null;
  branch: FormDataEntryValue | null;
  formId: FormDataEntryValue | null;
  fname: FormDataEntryValue | null;
  lname: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  dob: DOB;
  commission: number;
  password: FormDataEntryValue | null;
  permissions: Permissions;
}

export interface onBoardRegularStaffRequest {
  admin: FormDataEntryValue | null;
  branch: FormDataEntryValue | null;
  formId: FormDataEntryValue | null;
  fname: FormDataEntryValue | null;
  lname: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  dob: DOB;
  password: FormDataEntryValue | null;
  permissions: Permissions;
}

export interface addOpeningHourReqquest {
  day: FormDataEntryValue | null;
  timeSlot: {
    from: FormDataEntryValue | null;
    to: FormDataEntryValue | null;
  };
}

export interface deleteOpeningHourReqquest {
  day: string;
  timeSlot: {
    from: string;
    to: string;
  };
}

export interface addServiceRequest {
  name: FormDataEntryValue | null; // Nullable since `formData.get` might return null
  category: {
    name: FormDataEntryValue | null;
    taxCode: FormDataEntryValue | null;
  };
  description: FormDataEntryValue | null;
  color: FormDataEntryValue | null;
  // priceType: FormDataEntryValue | null;
  priceAmount: number;
  estimatedTime: {
    hours: number;
    minutes: number;
  };
  bufferTime: {
    hours: number;
    minutes: number;
  };
  staffs: string[];
}

export interface updateServiceStatusRequest {
  status: "active" | "paused";
}

export interface fetchProductOrServiceResponse {
  error?: string;
  message?: { _id: string; name: string }[];
}

export interface addAddonRequest {
  [key: string]: FormDataEntryValue | null | boolean;
}

interface Policy {
  collectCancelFee: boolean;
  feeTypeForCancel?: string;
  cancelFeeValue?: number;
  collectNoshowFee: boolean;
  feeTypeForNoshow?: string;
  noshowFeeValue?: number;
}

export interface setUpSettingsRequest {
  policy: Policy;
  leadTime: number;
  bookingWindow: number;
}

export interface AddProductImageResponse {
  error?: string;
  message?: { imageId: string; fileName: string };
}

type AddProductCategory = {
  name: FormDataEntryValue | null;
  taxCode: FormDataEntryValue | null;
};

type AddProductSizeDetail = {
  sizeType: string | undefined;
  quantity: string | undefined;
};

export interface addProductRequestt {
  name: FormDataEntryValue | null;
  category: AddProductCategory;
  description: FormDataEntryValue | null;
  price: number;
  expiryDate: FormDataEntryValue | null;
  SKU: FormDataEntryValue | null;
  barcode: FormDataEntryValue | null;
  sizeBasedQuantity: {
    enabled: boolean;
    details?: AddProductSizeDetail[]; // Optional if `sizeBased` is false
  };
  quantity: number;
  sellOnlyWithAppointment: boolean;
  images: DraftImage[]; // Assuming `draftImages` contains an array of image URLs or paths
}

type Unit = "business_day" | string;

export interface addShippingOptionRequest {
  displayName: string | null;
  amount: number;
  minEstimate: number;
  maxEstimate: number;
  unit: Unit;
}

export interface addAllowedCountryRequest {
  country: {
    name: FormDataEntryValue | null;
    isoCode: FormDataEntryValue | null;
  };
}

export interface AddBlogImageResponse {
  error?: string;
  message?: { imageId: string; fileName: string };
}

interface Cover {
  url: string;
  imageId: string;
  fileName: string;
}

export interface publishBlogRequest {
  title: FormDataEntryValue | null;
  shortDescription: FormDataEntryValue | null;
  author: FormDataEntryValue | null;
  content: FormDataEntryValue | null;
  coverImage: Cover;
}

export interface addCouponRequest {
  valueType: "percent_off" | "amount_off";
  value: number;
  maxRedemptions: number;
  expiresAt: FormDataEntryValue | null;
  appliesTo?: {
    products: string[];
  };
  addedProducts?: string[];
  addedServices?: string[];
}

type PromotionCodeRestrictions = {
  firstTransactionOnly: boolean;
  minimumAmount?: number;
};

export interface addPromotionCodeRequest {
  coupon: FormDataEntryValue | null;
  stripeCouponId: FormDataEntryValue | null;
  code: FormDataEntryValue | null;
  maxRedemptions?: number;
  restrictions: PromotionCodeRestrictions;
}

export interface LoyaltyPointSettingsRequest {
  monetaryEquivalent: number;
  enableReferral: boolean;
  minimumReferral: number;

  enableAppointment: boolean;
  minimumAmountEnabledApt: boolean;
  minimumAmountApt: number;
  appliesToApt: boolean;
  aptServiceIds: string[];

  enableProduct: boolean;
  minimumAmountEnabledProd: boolean;
  minimumAmountProd: number;
  appliesToProd: boolean;
  prodServiceIds: string[];
}

export interface CustomerStaffsType {
  _id: string;
  fname: string;
  lname: string;
  active: boolean;
}

export interface CustomerServiceType {
  _id: string;
  name: string;
  description: string;
  priceAmount: number;
  estimatedTime: { hours: number; minutes: number };
  staffs: CustomerStaffsType[];
  bufferTime: { hours: number; minutes: number };
  stripeData: { productId: string };
}

export interface FetchCustomerServiceResponse {
  error?: string;
  message?: CustomerServiceType[];
}

export interface Availability {
  date: string;
  slots: string[];
}

export interface fetchAvailabilityResponse {
  error?: string;
  message?: Availability[] | string;
}

export interface BookingSettingType {
  branch: { _id: string; timeZone: string };
  policy: {
    collectCancelFee: boolean;
    feeTypeForCancel: "fixed" | "percent" | null;
    cancelFeeValue: number;
    cancellationNotice: number;

    collectNoshowFee: boolean;
    feeTypeForNoshow: "fixed" | "percent" | null;
    noshowFeeValue: number;
  };
  leadTime: number;
}

export interface fetchSettingsResponse {
  error?: string;
  message?: BookingSettingType | string;
}

export interface bookingRequestData {
  service: string;
  staff: string;
  date: string;
  branch: string;
  bookedTime: {
    from: string;
    to: string;
  };
  bookedTimeWithBuffer: {
    from: string;
    to: string;
  };
}

export interface CustomerProductType {
  _id: string;
  name: string;
  category: {
    name: string;
    taxCode: string;
  };
  description?: string;
  price: number;
  expiryDate?: string;
  sizeBasedQuantity: {
    enabled: boolean;
    details: {
      sizeType?: string;
      quantity?: number;
    }[];
  };
  quantity?: number;
  images: {
    url: string;
    fileName?: string;
    imageId: string;
  }[];
  sellOnlyWithAppointment: boolean;
  inStock: boolean;
  stripeData: {
    priceId?: string;
    productId?: string;
  };
  createdAt: string; // Timestamp as an ISO string
  updatedAt: string; // Timestamp as an ISO string
}

export interface ValidCouponType {
  valueType: string;
  value: number;
  addedProducts: { _id: string }[];
  promotionCodes: { _id: string; code: string }[];
}

export interface fetchValidCouponResponse {
  error?: string;
  message?: ValidCouponType[];
}

export interface confirmStockB4CheckoutReesponse {
  error?: string;
  insufficientStockItems?: { productName: string; available: number }[];
  message?: string;
}

export interface checkAppointmentActionResponse {
  error?: string;
  message?: { condition: string; charge: boolean };
}

export interface checkAppointmentActionRequest {
  window: number;
  fee: number;
  branch: string;
  bookedTime: string;
  bookedDate: string;
}

export interface ValidCouponService {
  value: number;
  valueType: string;
  promotionCodes: string[];
}

export interface fetchValidCouponServiceResponse {
  error?: string;
  message?: ValidCouponService[] | string;
}

export interface calculateTaxResponse {
  error?: string;
  message?: { amount: number; amount_tax: number; quantity: number }[];
}

export interface updateOrderStatusRequest {
  shippingAddress: {
    line1: FormDataEntryValue | null;
    city: FormDataEntryValue | null;
    state: FormDataEntryValue | null;
    country: FormDataEntryValue | null;
    postal_code: FormDataEntryValue | null;
  };
  status: FormDataEntryValue | null;
}

export interface createSaleRequest {
  customer?: string;
  products: {
    product: string;
    quantity: number;
    size?: string;
    price: number;
  }[];
  totalAmount: number;
  totalDiscount: number;
  totalTax: number;
  paymentMethod: "cash" | "card" | "mobile payment";
}

export interface CalendarAppointmentType {
  _id: string;
  service: {
    name: string;
    description?: string;
    color: string;
  };
  owner: {
    fname: string;
    lname: string;
    email: string;
  };
  staff: {
    fname: string;
    lname: string;
    email: string;
  };
  date: string;
  bookedTime: {
    from: string;
    to: string;
  };
  policy?: {
    noShowFee?: {
      enabled: boolean;
    };
  };
  status: "pending" | "cancelled" | "completed" | "no show";
  isPast: boolean;
  start: number;
  end: number;
}

export interface getStaffAppointmentsResponse {
  error?: string;
  message?: CalendarAppointmentType[];
}

// export interface UploadAvatarRequest {
//   data: FormDataEntryValue | null;
// }
