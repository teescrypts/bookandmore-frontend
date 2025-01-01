"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Add from "@/icons/untitled-ui/duocolor/add";
import ModalBox from "@/components/modal";
import AddCoupon from "./add-coupon";
import {
  CouponType,
  ProductType,
  ServiceType,
} from "../../../marketing/discounts/page";
import Coupons from "./coupons";

type PropType = {
  coupons: CouponType[];
  products: ProductType[];
  services: ServiceType[];
};

const DiscountSettings: React.FC<PropType> = ({
  coupons,
  products,
  services,
}) => {
  const [showCouponModal, setShowCouponModal] = useState(false);

  return (
    <>
      <Card>
        <CardContent>
          <Stack>
            <Typography variant="h6">Discount Settings</Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Coupons</Typography>
              <Button
                startIcon={<Add />}
                variant="contained"
                color="primary"
                sx={{ mt: 1 }}
                onClick={() => setShowCouponModal(true)}
              >
                Add Coupon
              </Button>
              <Coupons coupons={coupons} />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <ModalBox
        open={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        title="New Coupon"
      >
        <AddCoupon
          onClose={() => setShowCouponModal(false)}
          products={products}
          services={services}
        />
      </ModalBox>
    </>
  );
};

export default DiscountSettings;
