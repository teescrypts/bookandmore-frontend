import { RouterLink } from "@/components/router-link";
import Gavel from "@/icons/untitled-ui/duocolor/gavel";
import Locations from "@/icons/untitled-ui/duocolor/location";
import StoreFront from "@/icons/untitled-ui/duocolor/store-front";
import Users03 from "@/icons/untitled-ui/duocolor/users-03";
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

function FeatureMenuItemsSec({
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
          href={"/features/tax"}
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
              <Gavel />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            secondary={
              <Typography variant="body2">
                Automatic or manual tax management
              </Typography>
            }
            primary={<Typography variant="subtitle1">Tax</Typography>}
          />
        </ListItem>
      </MenuItem>
      <MenuItem disableRipple>
        <ListItem
          onClick={toggleDrawer(false)}
          component={RouterLink}
          href={"/features/staff"}
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
              <Users03 />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            secondary={
              <Typography variant="body2">
                Commission based and regular staffs
              </Typography>
            }
            primary={<Typography variant="subtitle1">Staff</Typography>}
          />
        </ListItem>
      </MenuItem>
      <MenuItem disableRipple>
        <ListItem
          onClick={toggleDrawer(false)}
          component={RouterLink}
          href={"/features/rent"}
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
              <StoreFront />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            secondary={
              <Typography variant="body2">
                Subscription and One time payment rents
              </Typography>
            }
            primary={<Typography variant="subtitle1">Booth Rent</Typography>}
          />
        </ListItem>
      </MenuItem>
      <MenuItem disableRipple>
        <ListItem
          onClick={toggleDrawer(false)}
          component={RouterLink}
          href={"/features/location"}
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
              <Locations />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            secondary={
              <Typography variant="body2">
                Multiple locations, One dashboard
              </Typography>
            }
            primary={
              <Typography variant="subtitle1">Multiple Locations</Typography>
            }
          />
        </ListItem>
      </MenuItem>
    </Stack>
  );
}

export default FeatureMenuItemsSec;
