import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";
import { SaleProps } from "../../pos/sales/page";

const SaleInfo: React.FC<{ sale: SaleProps }> = ({ sale }) => {
  return (
    <Card sx={{ margin: "auto", mt: 4,}}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Sale Details
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="h6">Customer Information</Typography>
          <Stack direction="row" spacing={2} alignItems="center" mt={1}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              {sale.customer ? sale.customer.fname[0] : "G"}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">
                {sale.customer
                  ? `${sale.customer.fname} ${sale.customer.lname}`
                  : "Guest"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sale.customer ? sale.customer.email : "No email provided"}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="h6">Products</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sale.products.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.size || "N/A"}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="h6">Payment Details</Typography>
          <Typography variant="body1">
            Total Amount: ${sale.totalAmount.toFixed(2)}
          </Typography>
          <Typography variant="body1">
            Total Discount: ${sale.totalDiscount.toFixed(2)}
          </Typography>
          <Typography variant="body1">
            Total Tax: ${sale.totalTax.toFixed(2)}
          </Typography>
          <Typography variant="body1">
            Payment Method: {sale.paymentMethod}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created At: {new Date(sale.createdAt).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SaleInfo;
