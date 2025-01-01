"use client";

import { useUserData } from "@/app/authentication/dashboard/auth-context";
import Locations from "@/icons/untitled-ui/duocolor/location";
import { Chip, Typography } from "@mui/material";
import React from "react";

function ActiveLocation() {
  const user = useUserData();

  return (
    <>
      {user && user.userData?.activeBranch ? (
        <Chip
          label={user?.userData.activeBranch.name}
          icon={<Locations />}
          color={user?.userData.activeBranch.opened ? "success" : "error"}
        />
      ) : (
        <Typography variant="h6" color="error">
          No Active Location
        </Typography>
      )}
    </>
  );
}

export default ActiveLocation;
