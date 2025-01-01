import { MenuItem, Popover } from "@mui/material";
import React from "react";

type PropType = {
  anchorEl: HTMLDivElement | null;
  onChange: () => void;
  onClose: () => void;
  open: boolean;
  tenants: string[];
};

function TenantSwitch({
  anchorEl,
  onChange,
  onClose,
  open = false,
  tenants,
  ...other
}: PropType) {
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "right",
        vertical: "bottom",
      }}
      disableScrollLock
      transformOrigin={{
        horizontal: "right",
        vertical: "top",
      }}
      keepMounted
      onClose={onClose}
      open={open}
      slotProps={{
        paper: {
          sx: { width: 180 },
        },
      }}
      {...other}
    >
      {tenants.map((tenant) => (
        <MenuItem key={tenant} onClick={() => onChange?.()}>
          {tenant}
        </MenuItem>
      ))}
    </Popover>
  );
}

export default TenantSwitch;
