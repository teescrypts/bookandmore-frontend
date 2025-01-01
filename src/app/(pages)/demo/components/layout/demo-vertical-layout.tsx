import { useMobileNav } from "@/app/(dashboard)/hooks/use-mobile-nav";
import {
  IconButton,
  styled,
  SvgIconProps,
  Theme,
  useMediaQuery,
} from "@mui/material";
import React, { ReactElement, ReactNode } from "react";
import SideNav from "./side-nav/side-nav";
import MobileNav from "./mobile-nav/mobile-nav";
import Menu from "@/icons/untitled-ui/duocolor/menu";

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

function DemoVerticalLayout({
  children,
  sections,
  navColor,
}: {
  children: ReactNode;
  sections: MenuSection[];
  navColor: "blend-in" | "discrete" | "evident";
}) {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const mobileNav: MobileNave = useMobileNav();

  return (
    <>
      {" "}
      {lgUp && <SideNav color={navColor} sections={sections} />}
      {!lgUp && (
        <IconButton
          sx={{ mt: "20vh" }}
          onClick={mobileNav.handleOpen}
          color="primary"
        >
          <Menu />
        </IconButton>
      )}
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

export default DemoVerticalLayout;
