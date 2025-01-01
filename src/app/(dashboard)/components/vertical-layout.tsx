import { styled, SvgIconProps, Theme, useMediaQuery } from "@mui/material";
import React, { ReactElement, ReactNode } from "react";
import { useMobileNav } from "../hooks/use-mobile-nav";
import TopNav from "./top-nav";
import SideNav from "./side-nav/side-nav";
import MobileNav from "./mobile-nav/mobile-nav";
import { useUserData } from "@/app/authentication/dashboard/auth-context";
import { useSections } from "../hooks/config";

interface MenuItem {
  title: string;
  path: string;
  icon?: ReactElement<SvgIconProps>;
  items?: MenuItem[];
}

interface MenuSection {
  subheader?: string | ReactNode;
  items: MenuItem[];
}

interface MobileNave {
  handleOpen: () => void;
  handleClose: () => void;
  open: boolean;
}

const SIDE_NAV_WIDTH = 280;

const VerticalLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const VerticalLayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
});

function VerticalLayout({
  children,
  navColor,
}: {
  children: ReactNode;
  navColor: "blend-in" | "discrete" | "evident";
}) {
  const { userData } = useUserData();

  const sections = useSections(userData!.type);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const mobileNav: MobileNave = useMobileNav();

  return (
    <>
      <TopNav onMobileNavOpen={mobileNav.handleOpen} />
      {lgUp && <SideNav color={navColor} sections={sections} />}
      {!lgUp && (
        <MobileNav
          color={navColor}
          onClose={mobileNav.handleClose}
          open={mobileNav.open}
          sections={sections}
        />
      )}
      <VerticalLayoutRoot>
        <VerticalLayoutContainer>{children}</VerticalLayoutContainer>
      </VerticalLayoutRoot>
    </>
  );
}

export default VerticalLayout;
