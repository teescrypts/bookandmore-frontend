import { RouterLink } from "@/components/router-link";
import LayoutAlt02 from "@/icons/untitled-ui/duocolor/layout-alt-02";
import Loyalty from "@/icons/untitled-ui/duocolor/loyalty";
import ShoppingBag03 from "@/icons/untitled-ui/duocolor/shopping-bag-03";
import Time from "@/icons/untitled-ui/duocolor/time";
import {
  Stack,
  MenuItem,
  ListItemIcon,
  SvgIcon,
  ListItemText,
  Typography,
  ListItem,
} from "@mui/material";
import React from "react";

function FeatureMenuItemPry({
  toggleDrawer,
}: {
  toggleDrawer: (open: boolean) => () => void;
}) {
  return (
    <Stack spacing={2}>
      <MenuItem disableRipple>
        <ListItem
          onClick={toggleDrawer(false)}
          component={RouterLink}
          href={"/features/booking"}
          sx={{
            my: 1,
            color: "text.primary",
            "&:hover": { color: "text.primary" },
            "&:active": { color: "text.primary" },
            "&:focus": { color: "text.primary" },
          }}
          disablePadding
        >
          <ListItemIcon>
            <SvgIcon color="primary">
              <Time />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            secondary={
              <Typography variant="body2">
                Easy to set up booking system
              </Typography>
            }
            primary={<Typography variant="subtitle1">Booking</Typography>}
          />
        </ListItem>
      </MenuItem>
      <MenuItem disableRipple>
        <ListItem
          onClick={toggleDrawer(false)}
          component={RouterLink}
          href={"/features/e-commerce"}
          sx={{
            my: 1,
            color: "text.primary",
            "&:hover": { color: "text.primary" },
            "&:active": { color: "text.primary" },
            "&:focus": { color: "text.primary" },
          }}
          disablePadding
        >
          <ListItemIcon>
            <SvgIcon color="primary">
              <ShoppingBag03 />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            secondary={
              <Typography variant="body2">
                Manage Online and In-person Sales
              </Typography>
            }
            primary={<Typography variant="subtitle1">E-commerce</Typography>}
          />
        </ListItem>
      </MenuItem>
      <MenuItem disableRipple>
        <ListItem
          onClick={toggleDrawer(false)}
          component={RouterLink}
          href={"/features/blog"}
          sx={{
            my: 1,
            color: "text.primary",
            "&:hover": { color: "text.primary" },
            "&:active": { color: "text.primary" },
            "&:focus": { color: "text.primary" },
          }}
          disablePadding
        >
          <ListItemIcon>
            <SvgIcon color="primary">
              <LayoutAlt02 />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            secondary={
              <Typography variant="body2">Manage Your Blog posts</Typography>
            }
            primary={<Typography variant="subtitle1">Blog</Typography>}
          />
        </ListItem>
      </MenuItem>
      <MenuItem disableRipple>
        <ListItem
          onClick={toggleDrawer(false)}
          component={RouterLink}
          href={"/features/marketing"}
          sx={{
            my: 1,
            color: "text.primary",
            "&:hover": { color: "text.primary" },
            "&:active": { color: "text.primary" },
            "&:focus": { color: "text.primary" },
          }}
          disablePadding
        >
          <ListItemIcon>
            <SvgIcon color="primary">
              <Loyalty />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            secondary={
              <Typography variant="body2">Strategic marketing</Typography>
            }
            primary={<Typography variant="subtitle1">Marketting</Typography>}
          />
        </ListItem>
      </MenuItem>
    </Stack>
  );
}

export default FeatureMenuItemPry;
