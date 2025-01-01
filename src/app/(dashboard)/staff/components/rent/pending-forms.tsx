"use client";

import React, { useState } from "react";
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
import { deleteRentForm } from "@/app/actions/actions";
import notify from "@/utils/toast";

interface PendingForm {
  _id: string;
  category: string;
  tenantInfo: {
    fname: string;
    lname: string;
    email: string;
  };
  link: string;
}

interface PendingFormsListProps {
  pendingForms: PendingForm[];
}

const PendingFormsList: React.FC<PendingFormsListProps> = ({
  pendingForms,
}) => {
  const [message, setMessage] = useState("");

  const handleDelete = async (id: string) => {
    const deleteResponse = await deleteRentForm(id);

    if (deleteResponse?.error) setMessage(deleteResponse.error);

    if (deleteResponse?.success) notify("Rent form deleted");
  };

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
      <Typography textAlign={"center"} color="error" variant="subtitle2">
        {message}
      </Typography>
      <List>
        {pendingForms.length > 0 ? (
          pendingForms.map((form) => {
            const tenantInfo = form.tenantInfo;
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
                    {" "}
                    <Tooltip title="Delete Link">
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleDelete(form._id)}
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
                            `${CLIENT_BASE_URL}/register/rent-forms/${form._id}`
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
                      {`${form.category} Rent form`}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Name: {`${tenantInfo.fname} ${tenantInfo.lname}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Email: {tenantInfo.email}
                      </Typography>
                      <Typography variant="body2" color="info">
                        Link:{" "}
                        {`${CLIENT_BASE_URL}/register/rent-forms/${form._id}`}
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