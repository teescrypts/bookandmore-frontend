import { isStaff } from "@/app/actions/action-types";
import { useUserData } from "@/app/authentication/dashboard/auth-context";
import Calendar from "@/icons/untitled-ui/duocolor/calendar";
import Favorite from "@/icons/untitled-ui/duocolor/favorite";
import FilledTime from "@/icons/untitled-ui/duocolor/filled-time";
import Gavel from "@/icons/untitled-ui/duocolor/gavel";
import Group from "@/icons/untitled-ui/duocolor/group";
import HomeSmile from "@/icons/untitled-ui/duocolor/home-smile";
import LayoutAlt02 from "@/icons/untitled-ui/duocolor/layout-alt-02";
import Locations from "@/icons/untitled-ui/duocolor/location";
import Loyalty from "@/icons/untitled-ui/duocolor/loyalty";
import ManageSettings from "@/icons/untitled-ui/duocolor/manage-settings";
import Pos from "@/icons/untitled-ui/duocolor/pos";
import Services from "@/icons/untitled-ui/duocolor/services";
import Settings from "@/icons/untitled-ui/duocolor/settings";
import ShoppingBag03 from "@/icons/untitled-ui/duocolor/shopping-bag-03";
import ShoppingCart01 from "@/icons/untitled-ui/duocolor/shopping-cart-01";
import StoreFront from "@/icons/untitled-ui/duocolor/store-front";
import Time from "@/icons/untitled-ui/duocolor/time";
import Truck01 from "@/icons/untitled-ui/duocolor/truck-01";
import User01 from "@/icons/untitled-ui/duocolor/user01";
import Users03 from "@/icons/untitled-ui/duocolor/users-03";
import { adminPaths, PathType, staffPaths } from "@/paths";

import { SvgIcon, SvgIconProps } from "@mui/material";
import { ReactElement, ReactNode, useMemo } from "react";

interface MenuItem {
  title: string;
  value: string;
  path: string;
  icon?: ReactElement<SvgIconProps>;
  items?: MenuItem[];
}

interface MenuSection {
  subheader?: string | ReactNode;
  items: MenuItem[];
}

type Role = "admin" | "staff" | "tenant" | "customer";
type Permissions = {
  [key: string]: boolean;
};

export const useSections = (role: Role): MenuSection[] => {
  let paths: PathType;
  let staffPermissions: Permissions;

  const { userData } = useUserData();

  if (userData && isStaff(userData)) {
    staffPermissions = userData.permissions;
  }

  switch (role) {
    case "admin":
      paths = adminPaths;
      break;

    case "staff":
      paths = staffPaths;
      break;

    default:
      break;
  }

  return useMemo(() => {
    const sections: MenuSection[] = [
      {
        items: [
          {
            title: "Home",
            value: "home",
            path: paths.dashboard.index,
            icon: (
              <SvgIcon fontSize="small">
                <HomeSmile />
              </SvgIcon>
            ),
          },
          {
            title: "Account",
            value: "account",
            path: paths.dashboard.account,
            icon: (
              <SvgIcon fontSize="small">
                <ManageSettings />
              </SvgIcon>
            ),
          },
          {
            title: "Locations",
            value: "locations",
            path: paths.dashboard.location,
            icon: (
              <SvgIcon fontSize="small">
                <Locations />
              </SvgIcon>
            ),
          },
          {
            title: "Tax",
            value: "tax",
            path: paths.dashboard.tax.index,
            icon: (
              <SvgIcon fontSize="small">
                <Gavel />
              </SvgIcon>
            ),
          },
          {
            title: "Customers",
            value: "customers",
            path: paths.dashboard.customer,
            icon: (
              <SvgIcon fontSize="small">
                <Group />
              </SvgIcon>
            ),
          },
        ],
      },
      {
        subheader: "BOOKINGS",
        items: [
          {
            title: "Opening Hours",
            value: "openingHours",
            path: paths.dashboard.booking.availability,
            icon: (
              <SvgIcon fontSize="small">
                <Time />
              </SvgIcon>
            ),
          },
          {
            title: "Calendar",
            value: "calendar",
            path: paths.dashboard.booking.calendar,
            icon: (
              <SvgIcon fontSize="small">
                <Calendar />
              </SvgIcon>
            ),
          },
        ],
      },
      {
        subheader: "SHOP",
        items: [
          {
            title: "Services",
            value: "services",
            path: paths.dashboard.booking.services,
            icon: (
              <SvgIcon fontSize="small">
                <Services />
              </SvgIcon>
            ),
          },
          {
            title: "Settings",
            value: "settings",
            path: paths.dashboard.booking.settings.index,
            icon: (
              <SvgIcon fontSize="small">
                <Settings />
              </SvgIcon>
            ),
          },
          {
            title: "Staffs",
            value: "staffs",
            path: paths.dashboard.staff.index,
            icon: (
              <SvgIcon fontSize="small">
                <Users03 />
              </SvgIcon>
            ),
          },
          {
            title: "Rent",
            value: "rent",
            path: paths.dashboard.rent.index,
            icon: (
              <SvgIcon fontSize="small">
                <StoreFront />
              </SvgIcon>
            ),
          },
        ],
      },
      {
        subheader: "E-COMMERCE",
        items: [
          {
            title: "Products",
            value: "products",
            path: paths.dashboard.ecommerce.products,
            icon: (
              <SvgIcon fontSize="small">
                <ShoppingBag03 />
              </SvgIcon>
            ),
          },
          {
            title: "POS",
            value: "pos",
            path: paths.dashboard.ecommerce.pos,
            icon: (
              <SvgIcon fontSize="small">
                <Pos />
              </SvgIcon>
            ),
          },
          {
            title: "Orders",
            value: "orders",
            path: paths.dashboard.ecommerce.orders,
            icon: (
              <SvgIcon fontSize="small">
                <ShoppingCart01 />
              </SvgIcon>
            ),
          },
          {
            title: "Shipping",
            value: "shipping",
            path: paths.dashboard.ecommerce.shipping,
            icon: (
              <SvgIcon fontSize="small">
                <Truck01 />
              </SvgIcon>
            ),
          },
        ],
      },
      {
        subheader: "MORE",
        items: [
          {
            title: "Blog",
            value: "blog",
            path: paths.dashboard.blog.index,
            icon: (
              <SvgIcon fontSize="small">
                <LayoutAlt02 />
              </SvgIcon>
            ),
          },
          {
            title: "Marketing",
            value: "marketing",
            path: paths.dashboard.marketing.index,
            icon: (
              <SvgIcon fontSize="small">
                <Loyalty />
              </SvgIcon>
            ),
            items: [
              {
                title: "Discounts",
                value: "discounts",
                path: paths.dashboard.marketing.discounts,
              },
              {
                title: "Loyalty Points",
                value: "loyaltyPoints",
                path: paths.dashboard.marketing.points,
              },
            ],
          },
        ],
      },
    ];

    if (role === "admin") {
      return sections;
    }

    if (role === "tenant") {
      return [
        {
          items: [
            {
              title: "Account",
              value: "account",
              path: "/tenant/account",
              icon: (
                <SvgIcon fontSize="small">
                  <ManageSettings />
                </SvgIcon>
              ),
            },
          ],
        },
      ];
    }

    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          return staffPermissions[item.value];
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [role]);
};
