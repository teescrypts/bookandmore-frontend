"use client";

import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Tooltip,
  Stack,
} from "@mui/material";
import Copy from "@/icons/untitled-ui/duocolor/copy";
import handleCopyLink from "@/utils/handle-copy-link";
import Delete from "@/icons/untitled-ui/duocolor/delete";
import { CLIENT_BASE_URL } from "@/paths";
import { deleteStaffForm } from "@/app/actions/actions";
import { PendingForm } from "../../staffs/pending-forms/page";

interface PendingFormsListProps {
  pendingForms: PendingForm[];
}

const PendingFormsList: React.FC<PendingFormsListProps> = ({
  pendingForms,
}) => {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "background.paper",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <List>
        {pendingForms.length > 0 ? (
          pendingForms.map((form) => {
            const { permissions } = form;
            const grantedPermissions = Object.entries(permissions)
              .filter(([_, value]) => value)
              .map(([key]) => key);
            const services = form.services.map((service) => service.name);

            return (
              <ListItem
                key={form._id}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  boxShadow: 1,
                  backgroundColor: "background.default",
                  px: 2,
                  py: 1.5,
                }}
                secondaryAction={
                  <Stack direction={"row"} spacing={2}>
                    <Tooltip title="Delete Link">
                      <IconButton
                        onClick={async () => await deleteStaffForm(form._id)}
                        edge="end"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy link">
                      <IconButton
                        edge="end"
                        color="primary"
                        onClick={() =>
                          handleCopyLink(
                            `${CLIENT_BASE_URL}/register/staff-onboarding-form/${form._id}`
                          )
                        }
                      >
                        <Copy />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                }
              >
                <ListItemText
                  disableTypography
                  primary={
                    <Typography variant="subtitle1" fontWeight="500">
                      {`${form.category} staff form`}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Name: {`${form.fname} ${form.lname}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Email: {form.email}
                      </Typography>
                      <Typography variant="body2" color="info">
                        Link:{" "}
                        {`${CLIENT_BASE_URL}/register/staff-onboarding-form/${form._id}`}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        Permissions:{" "}
                        {grantedPermissions.length > 0
                          ? grantedPermissions.join(", ")
                          : "No permissions granted"}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        Services:{" "}
                        {services.length > 0
                          ? services.join(", ")
                          : "No Service Allocated"}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            );
          })
        ) : (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
            <Typography color="text.secondary">
              No pending forms available
            </Typography>
          </Stack>
        )}
      </List>
    </Box>
  );
};

export default PendingFormsList;
