import Delete from "@/icons/untitled-ui/duocolor/delete";
import {
  Box,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import React from "react";

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 && (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      )}
      {numSelected > 0 && (
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Booking Access"
        />
      )}
    </Toolbar>
  );
}

export default EnhancedToolbar;
