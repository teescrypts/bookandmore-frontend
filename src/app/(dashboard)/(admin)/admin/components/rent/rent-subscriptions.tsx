"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Button,
  Tooltip,
  Divider,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ListSubheader,
  useTheme,
} from "@mui/material";
import Add from "@/icons/untitled-ui/duocolor/add";
import Edit from "@/icons/untitled-ui/duocolor/edit";
import Delete from "@/icons/untitled-ui/duocolor/delete";
import ModalBox from "@/components/modal";
import { SubmitButton } from "@/components/submit-button";
import { useFormState } from "react-dom";
import { addSubscription, deleteSubscription } from "@/app/actions/actions";
import { Subscription } from "../../rent/page";
import EmptyState from "@/components/empty-state";
import notify from "@/utils/toast";
import Link from "next/link";
import { adminPaths } from "@/paths";

interface RentSubscriptionsProps {
  subscriptions: Subscription[];
}

const initialValue: { error?: string; success?: string } | undefined = {};

const RentSubscriptions: React.FC<RentSubscriptionsProps> = ({
  subscriptions,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const theme = useTheme();

  const [state, formAction] = useFormState(addSubscription, initialValue);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.success) {
        notify("Submission Uploaded");
        handleClose();
      }
    }
  }, [state]);

  const handleDeleteSubscription = async (id: string) => {
    const result = await deleteSubscription(id);
    if (result?.error) setMessage(result.error);
    if (result?.success) notify("Subscription deleted");
  };

  return (
    <>
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
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" fontWeight="bold">
            Rent Subscriptions
          </Typography>
          <Button
            startIcon={<Add />}
            variant="contained"
            color="primary"
            onClick={handleOpen}
          >
            Add Subscription
          </Button>
        </Stack>
        <List>
          <ListSubheader sx={{ color: theme.palette.error.main }}>
            {message}
          </ListSubheader>
          {subscriptions.length > 0 ? (
            subscriptions.map((subscription) => (
              <Box key={subscription._id}>
                <ListItem
                  sx={{
                    mb: 1,
                    px: 2,
                    py: 1.5,
                  }}
                  secondaryAction={
                    <>
                      {" "}
                      <Tooltip sx={{ mr: 2 }} title="Edit Subscription">
                        <Link
                          href={`${adminPaths.dashboard.rent.index}/${subscription._id}`}
                        >
                          <IconButton edge="end" color="primary">
                            <Edit />
                          </IconButton>
                        </Link>
                      </Tooltip>
                      <Tooltip sx={{ ml: 2 }} title="Delete Subscription">
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={async () =>
                            await handleDeleteSubscription(subscription._id)
                          }
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="500">
                        {subscription.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        ${subscription.amount}/{subscription.interval}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider />
              </Box>
            ))
          ) : (
            <EmptyState
              message="You have not added any subscription"
              actionLabel="Add Subscription"
              onActionClick={handleOpen}
            />
          )}
        </List>
      </Box>

      <ModalBox open={open} onClose={handleClose} title="Add Subscriptions">
        <form action={formAction}>
          <Stack spacing={2}>
            <Typography textAlign={"center"} variant="subtitle2" color="error">
              {message}
            </Typography>
            <TextField
              required
              fullWidth
              name="name"
              label="Subscription Name"
              variant="outlined"
              placeholder="For example; Monthly rent subscription"
              type="text"
            />

            <FormControl fullWidth>
              <InputLabel id="interval">Duration</InputLabel>
              <Select
                required
                labelId="interval"
                id="interval-select"
                name="interval"
                label="Interval"
              >
                <MenuItem value={"week"}>Weekly</MenuItem>
                <MenuItem value={"month"}>Monthly</MenuItem>
              </Select>
            </FormControl>

            <TextField
              required
              name="amount"
              label="Price"
              variant="outlined"
              type="number"
              slotProps={{ input: { startAdornment: "$" } }}
            />

            <TextField
              multiline
              rows={3}
              name="description"
              label="Description"
              variant="outlined"
              type="text"
            />

            <SubmitButton title="Add subscription" isFullWidth={true} />
          </Stack>
        </form>
      </ModalBox>
    </>
  );
};

export default RentSubscriptions;
