import { usePopover } from "@/hooks/use-popover";
import User01 from "@/icons/untitled-ui/duocolor/user01";
import { Avatar, Box, ButtonBase, SvgIcon } from "@mui/material";
import React from "react";
import AccountPopover from "./account-popover";
import { AdminType, TenantType, StaffType } from "@/app/actions/action-types";
import { API_BASE_URL } from "@/paths";

const useMockedUser = () => {
  return {
    id: "5e86809283e28b96d2d38537",
    avatar: "/assets/avatars/avatar-anika-visser.png",
    name: "Anika Visser",
    email: "anika.visser@devias.io",
  };
};

function AccountButton({
  user,
  userType,
}: {
  user: AdminType | TenantType | StaffType | null;
  userType: string | null;
}) {
  const popover = usePopover();

  if (user && userType) {
    return (
      <>
        <Box
          component={ButtonBase}
          onClick={popover.handleOpen}
          ref={popover.anchorRef}
          sx={{
            alignItems: "center",
            display: "flex",
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "divider",
            height: 40,
            width: 40,
            borderRadius: "50%",
          }}
        >
          <Avatar
            sx={{
              height: 32,
              width: 32,
            }}
            src={`${API_BASE_URL}/users/${user.id}/avatar`}
          >
            <SvgIcon>
              <User01 />
            </SvgIcon>
          </Avatar>
        </Box>
        <AccountPopover
          anchorEl={popover.anchorRef.current}
          onClose={popover.handleClose}
          open={popover.open}
          user={user}
          userType={userType}
        />
      </>
    );
  }
}

export default AccountButton;
