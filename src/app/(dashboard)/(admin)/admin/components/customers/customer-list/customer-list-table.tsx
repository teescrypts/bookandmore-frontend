"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Tooltip,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/system";
import { CustomerInfo } from "../../../customers/page";
import Search from "@/icons/untitled-ui/duocolor/search";

interface Props {
  customerInfo: CustomerInfo[];
}

// Styled components for enhanced visuals
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  backgroundColor: theme.palette.grey[200],
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.3)",
}));

const CustomerInfoTable: React.FC<Props> = ({ customerInfo }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
    setPage(0);
  };

  // Filter data based on the search query
  const filteredData = customerInfo.filter(
    (customer) =>
      customer.customerName.toLowerCase().includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery)
  );

  return (
    <Box>
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Search by name or email"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
        onChange={handleSearch}
        value={searchQuery}
      />
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Total Loyalty Points</StyledTableCell>
              <StyledTableCell>Cancelled Appointments</StyledTableCell>
              <StyledTableCell>Completed Appointments</StyledTableCell>
              <StyledTableCell>Total Appointments</StyledTableCell>
              <StyledTableCell>Purchases</StyledTableCell>
              <StyledTableCell>Created At</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.loyaltyPoint.total}</TableCell>
                  <TableCell>{row.cancelledAppointments}</TableCell>
                  <TableCell>{row.completedAppointments}</TableCell>
                  <TableCell>{row.totalAppointments}</TableCell>
                  <TableCell>{row.purcheses}</TableCell>
                  <TableCell>
                    {new Date(row.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default CustomerInfoTable;
