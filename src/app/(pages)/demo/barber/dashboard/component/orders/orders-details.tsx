"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import { format } from "date-fns";
import ShoppingCart01 from "@/icons/untitled-ui/duocolor/shopping-cart-01";
import LocalShipping from "@/icons/untitled-ui/duocolor/local-shipping";
import Paid from "@/icons/untitled-ui/duocolor/paid";
import { CustomerOrderType } from "../../orders/page";

interface OrderDetailsProps {
  order: CustomerOrderType;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  return (
    <Card sx={{ maxWidth: 800, mx: "auto", my: 4, p: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Order Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Order Info */}
        <Box mb={3}>
          <Typography variant="body1" color="text.secondary">
            Order ID: <strong>{order._id}</strong>
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Placed on:{" "}
            <strong>{format(new Date(order.createdAt), "PPP")}</strong>
          </Typography>
        </Box>

        {/* Product Details */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Products
        </Typography>
        {order.products.map((product, index) => (
          <Box key={index} mb={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar>
                <ShoppingCart01 />
              </Avatar>
              <Box>
                <Typography variant="subtitle1">
                  {product.product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {product.quantity} | Size: {product.size || "N/A"} |
                  Price: ${product.price.toFixed(2)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        ))}

        <Divider sx={{ my: 3 }} />

        {/* Payment & Shipping */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Summary
          </Typography>
          <Typography variant="body1">
            Total Amount: <strong>${order.totalAmount.toFixed(2)}</strong>
          </Typography>
          <Typography variant="body1">
            Discount: <strong>-${order.totalDiscount.toFixed(2)}</strong>
          </Typography>
          <Typography variant="body1">
            Shipping: <strong>${order.totalShipping.toFixed(2)}</strong>
          </Typography>
          <Typography variant="body1">
            Tax: <strong>${order.totalTax.toFixed(2)}</strong>
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Order Status */}
        <Box mb={3}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Status
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label={order.status}
              color={
                order.status === "delivered"
                  ? "success"
                  : order.status === "cancelled"
                  ? "error"
                  : "warning"
              }
              icon={<LocalShipping />}
            />
            <Chip
              label={order.paymentStatus}
              color={
                order.paymentStatus === "paid"
                  ? "success"
                  : order.paymentStatus === "refunded"
                  ? "error"
                  : "warning"
              }
              icon={<Paid />}
            />
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Shipping Address */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Shipping Address
          </Typography>
          <Typography variant="body1">{order.shippingAddress.line1}</Typography>
          {order.shippingAddress.line2 && (
            <Typography variant="body1">
              {order.shippingAddress.line2}
            </Typography>
          )}
          <Typography variant="body1">
            {order.shippingAddress.city}, {order.shippingAddress.state},{" "}
            {order.shippingAddress.postal_code}
          </Typography>
          <Typography variant="body1">
            {order.shippingAddress.country}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;
