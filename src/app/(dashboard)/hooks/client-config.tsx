import Loyalty from "@/icons/untitled-ui/duocolor/loyalty";
import ShoppingBag03 from "@/icons/untitled-ui/duocolor/shopping-bag-03";
import Time from "@/icons/untitled-ui/duocolor/time";
import User01 from "@/icons/untitled-ui/duocolor/user01";
import { SvgIcon } from "@mui/material";
import { useMemo } from "react";

export const useSections = () => {
  return useMemo(() => {
    return [
      {
        items: [
          {
            title: "Profile",
            value: "profile",
            path: "/demo/barber/dashboard/profile",
            icon: (
              <SvgIcon fontSize="small">
                <User01 />
              </SvgIcon>
            ),
          },
          {
            title: "Appointments",
            value: "appointments",
            path: "/demo/barber/dashboard/appointments",
            icon: (
              <SvgIcon fontSize="small">
                <Time />
              </SvgIcon>
            ),
          },
          {
            title: "Orders",
            value: "orders",
            path: "/demo/barber/dashboard/orders",
            icon: (
              <SvgIcon fontSize="small">
                <ShoppingBag03 />
              </SvgIcon>
            ),
          },
          {
            title: "Loyalty Point",
            value: "loyaltyPoint",
            path: "/demo/barber/dashboard/loyalty-point",
            icon: (
              <SvgIcon fontSize="small">
                <Loyalty />
              </SvgIcon>
            ),
          },
        ],
      },
    ];
  }, []);
};
