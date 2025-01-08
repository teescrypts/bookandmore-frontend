"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Stack,
  Button,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Divider,
  InputLabel,
} from "@mui/material";
import {
  CouponType,
  ProductType,
  ServiceType,
} from "../../../marketing/discounts/page";
import { useFormState } from "react-dom";
import { addCoupon } from "@/app/actions/actions";
import { SubmitButton } from "@/components/submit-button";
import notify from "@/utils/toast";

const initialState: { error?: string; success?: string } | null = null;

const AddCoupon = ({
  coupons,
  products,
  services,
  onClose,
}: {
  coupons: CouponType[];
  products: ProductType[];
  services: ServiceType[];
  onClose: () => void;
}) => {
  const [valueType, setValueType] = useState<string | undefined>("");
  const [addedProducts, setAddedProducts] = useState<
    { productId: string; stripeId: string }[]
  >([]);
  const [addedServices, setAddedServices] = useState<
    { serviceId: string; stripeId: string }[]
  >([]);

  const handleProductSelection = (
    checked: boolean,
    productId: string,
    stripeId: string
  ) => {
    if (checked) {
      setAddedProducts((prev) => [...prev, { productId, stripeId }]);
    } else {
      const newProducts = addedProducts.filter(
        (prod) => prod.productId !== productId
      );
      setAddedProducts(newProducts);
    }
  };

  const handleServiceSelection = (
    checked: boolean,
    serviceId: string,
    stripeId: string
  ) => {
    if (checked) {
      setAddedServices((prev) => [...prev, { serviceId, stripeId }]);
    } else {
      const newServices = addedServices.filter(
        (service) => service.serviceId !== serviceId
      );
      setAddedServices(newServices);
    }
  };

  const [message, setMessage] = useState("");
  const addCouponPro = addCoupon.bind(
    null,
    addedProducts,
    addedServices,
    coupons
  );
  const [state, formAction] = useFormState(addCouponPro, initialState);

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.success) {
        notify(state.success);
        onClose();
      }
    }
  }, [state]);

  return (
    <form action={formAction}>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Value Type</InputLabel>
        <Select
          value={valueType}
          onChange={(e) => setValueType(e.target.value)}
          name="valueType"
          label="Value Type"
          required
        >
          <MenuItem value="amount">Amount Off</MenuItem>
          <MenuItem value="percentage">Percentage Off</MenuItem>
        </Select>
      </FormControl>
      {valueType && (
        <TextField
          variant="outlined"
          required
          fullWidth
          type="number"
          name="value"
          label={
            valueType === "percentage" ? "Value in percentage" : "Value in USD"
          }
          sx={{ mt: 2 }}
        />
      )}
      <TextField
        variant="outlined"
        required
        fullWidth
        type="number"
        label="Max Redemptions"
        name="maxRedemptions"
        sx={{ mt: 2 }}
      />
      <TextField
        variant="outlined"
        required
        fullWidth
        type="date"
        label="Expires At"
        sx={{ mt: 2 }}
        name="expiresAt"
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />

      <Typography
        variant="subtitle2"
        color="info"
        textAlign={"center"}
        sx={{ mt: 3, mb: 2 }}
      >
        If no specific product or service is selected, the discount will be
        applied universally to all products and services.
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Select Eligible Products
      </Typography>
      <List>
        {products.length > 0 ? (
          products.map((product) => (
            <ListItem key={product._id}>
              <Checkbox
                onChange={(e) =>
                  handleProductSelection(
                    e.target.checked,
                    product._id,
                    product.stripeData.productId
                  )
                }
              />
              <ListItemText primary={`${product.name} - $${product.price}`} />
            </ListItem>
          ))
        ) : (
          <Typography variant="subtitle2" color="info">
            You have not added any product
          </Typography>
        )}
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" sx={{ mt: 3 }}>
        Select Eligible Services
      </Typography>
      <List>
        {services.length > 0 ? (
          services.map((service) => (
            <ListItem key={service._id}>
              <Checkbox
                onChange={(e) =>
                  handleServiceSelection(
                    e.target.checked,
                    service._id,
                    service.stripeData.productId
                  )
                }
              />
              <ListItemText
                primary={`${service.name} - $${service.priceAmount}`}
              />
            </ListItem>
          ))
        ) : (
          <Typography>You have not added any service</Typography>
        )}
      </List>

      <Typography variant="subtitle2" color="error" textAlign={"center"}>
        {message}
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mt: 3 }}
      >
        <SubmitButton title="Add coupon" isFullWidth={false} />
      </Stack>
    </form>
  );
};

export default AddCoupon;
