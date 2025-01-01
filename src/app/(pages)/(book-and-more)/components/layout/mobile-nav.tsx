import { RouterLink } from "@/components/router-link";
import Close from "@/icons/untitled-ui/duocolor/close";
import ExpendLess from "@/icons/untitled-ui/duocolor/expand-less";
import ExpandMore from "@/icons/untitled-ui/duocolor/expand-more";
import {
  Drawer,
  Box,
  Stack,
  IconButton,
  Divider,
  List,
  ListItem,
  Collapse,
  MenuList,
  ListSubheader,
} from "@mui/material";
import React, { useState } from "react";
import FeatureMenuItemPry from "./feature-menu-items-pry";
import FeatureMenuItemsSec from "./feature-menu-items-sec";

function MobileNav({
  featuresOpen,
  drawerOpen,
  toggleDrawer,
  handleFeaturesClick,
}: {
  featuresOpen: boolean;
  drawerOpen: boolean;
  toggleDrawer: (open: boolean) => () => void;
  handleFeaturesClick: () => void;
}) {
  return (
    <Drawer
      PaperProps={{ sx: { width: "80%" } }}
      anchor="right"
      open={drawerOpen}
      onClose={toggleDrawer(false)}
    >
      <Box onKeyDown={toggleDrawer(false)} sx={{ p: 2 }} role="presentation">
        <Stack direction={"row"} justifyContent={"flex-end"}>
          <IconButton
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Close />
          </IconButton>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <List>
          <ListItem
            disablePadding
            onClick={handleFeaturesClick}
            secondaryAction={featuresOpen ? <ExpandMore /> : <ExpendLess />}
            sx={{ my: 1 }}
          >
            Features
          </ListItem>

          <Collapse in={featuresOpen}>
            <MenuList>
              <ListSubheader>PRIMARY</ListSubheader>
              <FeatureMenuItemPry toggleDrawer={toggleDrawer} />
            </MenuList>
            <MenuList disableListWrap>
              <ListSubheader>SECONDARY</ListSubheader>
              <FeatureMenuItemsSec toggleDrawer={toggleDrawer} />
            </MenuList>
          </Collapse>

          <ListItem
            onClick={toggleDrawer(false)}
            component={RouterLink}
            href={"/pricing"}
            sx={{
              my: 1,
              color: "text.primary",
              "&:hover": { color: "text.primary" },
              "&:active": { color: "text.primary" },
              "&:focus": { color: "text.primary" },
            }}
            disablePadding
          >
            Pricing
          </ListItem>
          <ListItem
            onClick={toggleDrawer(false)}
            component={RouterLink}
            href={"/how-it-works"}
            sx={{
              my: 1,
              color: "text.primary",
              "&:hover": { color: "text.primary" },
              "&:active": { color: "text.primary" },
              "&:focus": { color: "text.primary" },
            }}
            disablePadding
          >
            How It Works
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default MobileNav;
