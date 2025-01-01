import { usePopover } from "@/hooks/use-popover";
import DownArrow from "@/icons/untitled-ui/duocolor/down-arrow";
import { Box, IconButton, Stack, SvgIcon, Typography } from "@mui/material";
import React from "react";
import TenantPopover from "./tenant-popover";

const tenants = ["Devias", "Acme Corp"];

function TenantSwitch(props: { sx: { [key: string]: string | number } }) {
  const popover = usePopover();
  return (
    <>
      <Stack alignItems="center" direction="row" spacing={2} {...props}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography color="inherit" variant="h6">
            BookAndMore
          </Typography>
          <Typography color="neutral.400" variant="body2">
            Production
          </Typography>
        </Box>
        {/* <IconButton onClick={popover.handleOpen} ref={popover.anchorRef}>
          <SvgIcon sx={{ fontSize: 16 }}>
            <DownArrow />
          </SvgIcon>
        </IconButton> */}
      </Stack>
      <TenantPopover
        anchorEl={popover.anchorRef.current}
        onChange={popover.handleClose}
        onClose={popover.handleClose}
        open={popover.open}
        tenants={tenants}
      />
    </>
  );
}

export default TenantSwitch;
