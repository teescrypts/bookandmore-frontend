import { useUserData } from "@/app/authentication/dashboard/auth-context";
import AccountButton from "@/components/account-button/account-button";
import ActiveLocation from "@/components/active-location";
import Menu from "@/icons/untitled-ui/duocolor/menu";
import { Box, IconButton, Stack, SvgIcon, Theme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { alpha } from "@mui/system/colorManipulator";
import React from "react";

const TOP_NAV_HEIGHT = 64;
const SIDE_NAV_WIDTH = 280;

function TopNav({
  onMobileNavOpen,
  ...other
}: {
  onMobileNavOpen: () => void;
}) {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const user = useUserData();
  const isAdmin = user.userType === "admin";

  return (
    <Box
      component="header"
      sx={{
        backdropFilter: "blur(6px)",
        backgroundColor: (theme: Theme) =>
          alpha(theme.palette.background.default, 0.9),
        position: "sticky",
        left: {
          lg: `${SIDE_NAV_WIDTH}px`,
        },
        top: 0,
        width: {
          lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
        },
        zIndex: (theme) => theme.zIndex.appBar,
      }}
      {...other}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          minHeight: TOP_NAV_HEIGHT,
          px: 2,
        }}
      >
        <Stack alignItems="center" direction="row" spacing={2}>
          {!lgUp && (
            <IconButton onClick={onMobileNavOpen}>
              <SvgIcon>
                <Menu />
              </SvgIcon>
            </IconButton>
          )}
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2}>
          {isAdmin && <ActiveLocation />}
          {/* <NotificationsButton /> */}
          <AccountButton user={user.userData} userType={user.userType} />
        </Stack>
      </Stack>
    </Box>
  );
}

export default TopNav;
