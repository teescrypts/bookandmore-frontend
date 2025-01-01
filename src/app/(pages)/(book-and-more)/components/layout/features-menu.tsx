"use client";

import Gavel from "@/icons/untitled-ui/duocolor/gavel";
import LayoutAlt02 from "@/icons/untitled-ui/duocolor/layout-alt-02";
import Locations from "@/icons/untitled-ui/duocolor/location";
import Loyalty from "@/icons/untitled-ui/duocolor/loyalty";
import ShoppingBag03 from "@/icons/untitled-ui/duocolor/shopping-bag-03";
import StoreFront from "@/icons/untitled-ui/duocolor/store-front";
import Time from "@/icons/untitled-ui/duocolor/time";
import Users03 from "@/icons/untitled-ui/duocolor/users-03";
import {
  Box,
  Button,
  Grid2,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import React, { useState } from "react";
import FeatureMenuItemPry from "./feature-menu-items-pry";
import FeatureMenuItemsSec from "./feature-menu-items-sec";

function FeaturesMenu({
  toggleDrawer,
}: {
  toggleDrawer: (open: boolean) => () => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleFeaturesHover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      onMouseEnter={handleFeaturesHover}
      onClick={handleClose}
      onMouseLeave={handleClose}
    >
      <Button endIcon={<ArrowDropDownIcon />} sx={{ color: "#000" }}>
        Features
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "features-button",
          onMouseLeave: handleClose,
        }}
      >
        <Grid2 container columnSpacing={1} sx={{ p: 4 }}>
          <Grid2 size={{ md: 6 }}>
            <Stack>
              <Typography variant="h6">PRIMARY</Typography>
              <MenuList>
                <FeatureMenuItemPry toggleDrawer={toggleDrawer} />
              </MenuList>
            </Stack>
          </Grid2>
          <Grid2 size={{ md: 6 }}>
            <Stack>
              <Typography variant="h6">SECONDARY</Typography>
              <MenuList>
                <FeatureMenuItemsSec toggleDrawer={toggleDrawer} />
              </MenuList>
            </Stack>
          </Grid2>
        </Grid2>
      </Menu>
    </Box>
  );
}

export default FeaturesMenu;
