export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "http://24.144.125.44:3002"
    : "http://localhost:3002";

export const CLIENT_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "bookandmore.live"
    : "http://localhost:3000";

export interface PathType {
  dashboard: {
    index: string;
    account: string;
    rent: {
      index: string;
      rentForm: string;
      rentLinks: string;
    };
    customer: string;
    staff: {
      index: string;
      add: string;
      pendingForms: string;
    };
    blog: {
      index: string;
      add: string;
    };
    tax: {
      index: string;
      settings: {
        manual: string;
        automatic: string;
      };
      editSettings: string;
    };
    logs: string;
    location: string;
    marketing: {
      index: string;
      discounts: string;
      points: string;
    };
    ecommerce: {
      products: string;
      add: string;
      orders: string;
      pos: string;
      shipping: string;
    };
    booking: {
      availability: string;
      services: string;
      settings: {
        index: string;
        setUp: string;
      };
      calendar: string;
    };
  };
}

export const adminPaths: PathType = {
  dashboard: {
    index: "/admin/home",
    account: "/admin/account",
    rent: {
      index: "/admin/rent",
      rentForm: "/admin/rent/rent-form",
      rentLinks: "/admin/rent/rent-links",
    },
    customer: "/admin/customers",
    staff: {
      index: "/admin/staffs",
      add: "/admin/staffs/add",
      pendingForms: "/admin/staffs/pending-forms",
    },
    blog: { index: "/admin/blog", add: "/admin/blog/add" },
    tax: {
      index: "/admin/tax",
      settings: {
        manual: "/admin/tax/settings/manual",
        automatic: "/admin/tax/settings/automatic",
      },
      editSettings: "/admin/tax/edit",
    },
    logs: "/admin/logs",
    location: "/admin/locations",
    marketing: {
      index: "/admin/marketing",
      discounts: "/admin/marketing/discounts",
      points: "/admin/marketing/loyalty-points",
    },
    ecommerce: {
      products: "/admin/e-commerce/products",
      add: "/admin/e-commerce/products/add",
      orders: "/admin/e-commerce/orders",
      pos: "/admin/e-commerce/pos",
      shipping: "/admin/e-commerce/shipping",
    },
    booking: {
      availability: "/admin/bookings/opening-hours",
      services: "/admin/bookings/services",
      settings: {
        index: "/admin/bookings/settings",
        setUp: "/admin/bookings/settings/set-up",
      },
      calendar: "/admin/bookings/calendar",
    },
  },
};

export const staffPaths: PathType = {
  dashboard: {
    index: "/staff/home",
    account: "/staff/account",
    rent: {
      index: "/staff/rent",
      rentForm: "/staff/rent/rent-form",
      rentLinks: "/staff/rent/rent-links",
    },
    customer: "/staff/customers",
    staff: {
      index: "/staff/staffs",
      add: "/staff/staffs/add",
      pendingForms: "/staff/staffs/pending-forms",
    },
    blog: { index: "/staff/blog", add: "/staff/blog/add" },
    tax: {
      index: "/staff/tax",
      settings: {
        manual: "/staff/tax/settings/manual",
        automatic: "/staff/tax/settings/automatic",
      },
      editSettings: "/staff/tax/edit",
    },
    logs: "/staff/logs",
    location: "/staff/locations",
    marketing: {
      index: "/staff/marketing",
      discounts: "/staff/marketing/discounts",
      points: "/staff/marketing/loyalty-points",
    },
    ecommerce: {
      products: "/staff/e-commerce/products",
      add: "/staff/e-commerce/products/add",
      orders: "/staff/e-commerce/orders",
      pos: "/staff/e-commerce/pos",
      shipping: "/staff/e-commerce/shipping",
    },
    booking: {
      availability: "/staff/bookings/opening-hours",
      services: "/staff/bookings/services",
      settings: {
        index: "/staff/bookings/settings",
        setUp: "/staff/bookings/settings/set-up",
      },
      calendar: "/staff/bookings/calendar",
    },
  },
};
