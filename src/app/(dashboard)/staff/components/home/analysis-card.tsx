import Delete from "@/icons/untitled-ui/duocolor/delete";
import Edit from "@/icons/untitled-ui/duocolor/edit";
import {
  Card,
  Stack,
  Box,
  Typography,
  Divider,
  CardActions,
  Button,
  SvgIcon,
  CardActionArea,
  List,
  ListItemIcon,
  ListItemText,
  ListItem,
} from "@mui/material";
import { ArrowRightIcon } from "@mui/x-date-pickers";
import React, { ReactNode } from "react";

type PropTypes = {
  title: string;
  icon: ReactNode;
  value: number;
  data: string;
  dataIcon: ReactNode;
};

function AnalysisCard({ title, icon, value, data, dataIcon }: PropTypes) {
  return (
    <Card>
      <Stack
        alignItems="center"
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={3}
        sx={{
          px: 4,
          py: 3,
        }}
      >
        <SvgIcon fontSize="large">{icon}</SvgIcon>
        <Box sx={{ flexGrow: 1 }}>
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
          <Typography color="text.primary" variant="h4">
            {value}
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <CardActionArea disabled>
        <ListItem
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <ListItemIcon sx={{ minWidth: "unset" }}>{dataIcon}</ListItemIcon>
          <ListItemText primary={data} />
        </ListItem>
      </CardActionArea>
    </Card>
  );
}

export default AnalysisCard;
