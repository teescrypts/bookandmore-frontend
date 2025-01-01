"use client";

import Filter from "@/icons/untitled-ui/duocolor/filter";
import formatDate from "@/utils/format-date";
import {
  Stack,
  SvgIcon,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import React from "react";

interface Rent {
  _id: string;
  tenant: {
    fname: string;
    lname: string;
    email: string;
  };
  status: string;
  paidOn: number;
  dueOn: number;
}

function RentListClient({ rents }: { rents: Rent[] }) {
  const [searchTerm, setSearchTerm] = React.useState("");

  return (
    <>
      <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
        <SvgIcon color="action" sx={{ mr: 1 }}>
          <Filter />
        </SvgIcon>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
          Search by name or email:
        </Typography>
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          variant="outlined"
          placeholder="Search..."
          sx={{ width: 250 }}
        />
      </Stack>

      <List>
        {rents
          .filter((rent) => {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const tenant = rent.tenant;
            return (
              !searchTerm ||
              tenant.fname.toLowerCase().includes(lowerCaseSearchTerm) ||
              tenant.email.toLowerCase().includes(lowerCaseSearchTerm) ||
              tenant.lname.toLowerCase().includes(lowerCaseSearchTerm)
            );
          })
          .map((rent) => (
            <ListItem
              key={rent._id}
              sx={{
                mb: 1,
                px: 2,
                py: 1.5,
              }}
              divider
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="h6" fontWeight="500">
                      {`${rent.tenant.fname} ${rent.tenant.lname}`}
                    </Typography>
                    <Chip
                      label={rent.status}
                      color={
                        rent.status === "Due"
                          ? "info"
                          : rent.status === "Cancelled"
                          ? "error"
                          : "success"
                      }
                    />
                  </Stack>
                }
                secondary={
                  <Typography variant="subtitle2" color="text.secondary">
                    Tenant Email: {rent.tenant.email} <br />
                    Payment Date: {formatDate(rent.paidOn)} <br />
                    Due Date: {formatDate(rent.dueOn)}
                  </Typography>
                }
              />
            </ListItem>
          ))}
      </List>
      {rents.length === 0 && (
        <Typography textAlign="center" color="text.secondary" sx={{ py: 3 }}>
          No rentals available.
        </Typography>
      )}
    </>
  );
}

export default RentListClient;
