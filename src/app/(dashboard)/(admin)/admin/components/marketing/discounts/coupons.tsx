"use client";

import React, { useState } from "react";
import { CouponType } from "../../../marketing/discounts/page";
import EmptyState from "@/components/empty-state";
import Add from "@/icons/untitled-ui/duocolor/add";
import Delete from "@/icons/untitled-ui/duocolor/delete";
import Remove from "@/icons/untitled-ui/duocolor/remove";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  Button,
  IconButton,
  Divider,
  List,
  ListSubheader,
  ListItemText,
} from "@mui/material";
import { format } from "date-fns";
import ModalBox from "@/components/modal";
import AddPromotionCode from "./add-promotion-code";
import PromotionCodeList from "./promotion-code-list";
import { deleteCoupon } from "@/app/actions/actions";
import notify from "@/utils/toast";

function formatCreatedAt(createdAt: Date): string {
  return format(new Date(createdAt), "MMMM d, yyyy");
}

function Coupons({ coupons }: { coupons: CouponType[] }) {
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [selectedCouponStripeId, setSelectedCoponStripeId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Stack spacing={2} sx={{ mt: 2 }}>
        {coupons.length > 0 ? (
          coupons.map((coupon, index) => {
            return (
              <Card key={coupon._id} variant="outlined">
                <Typography
                  variant="subtitle2"
                  color="error"
                  textAlign={"center"}
                >
                  {message}
                </Typography>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body1">
                      {coupon.valueType === "amount_off"
                        ? `Amount Off: $${coupon.value}`
                        : `Percentage Off: ${coupon.value}%`}
                    </Typography>
                    <IconButton
                      disabled={loading}
                      color="error"
                      onClick={async () => {
                        setLoading(true);
                        const result = await deleteCoupon(coupon._id);

                        if (result?.error) {
                          setMessage(result.error);
                          setLoading(false);
                        }
                        if (result?.success) {
                          notify(result.success);
                          setLoading(false);
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                  <Typography variant="body2">
                    Max Redemptions: {coupon.maxRedemptions}
                  </Typography>
                  <Typography variant="body2">
                    Valid Till: {formatCreatedAt(new Date(coupon.expiresAt))}
                  </Typography>

                  <List>
                    {coupon?.addedProducts &&
                      coupon.addedProducts.length > 0 && (
                        <ListSubheader>Products</ListSubheader>
                      )}
                    {coupon?.addedProducts &&
                      coupon.addedProducts.length > 0 &&
                      coupon.addedProducts.map((prod) => {
                        return (
                          <ListItemText
                            key={prod._id}
                            primary={
                              <Typography variant="body2">
                                {prod.name}
                              </Typography>
                            }
                          />
                        );
                      })}
                  </List>

                  <List>
                    {coupon?.addedServices &&
                      coupon.addedServices.length > 0 && (
                        <ListSubheader>Services</ListSubheader>
                      )}
                    {coupon?.addedServices &&
                      coupon.addedServices.length > 0 &&
                      coupon.addedServices.map((service) => {
                        return (
                          <ListItemText
                            key={service._id}
                            primary={
                              <Typography variant="body2">
                                {service.name}
                              </Typography>
                            }
                          />
                        );
                      })}
                  </List>

                  {coupon.addedServices.length === 0 &&
                    coupon.addedProducts.length === 0 && (
                      <Typography variant="subtitle2">
                        Applies to all products and services
                      </Typography>
                    )}

                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      setSelectedCoupon(coupon._id);
                      setSelectedCoponStripeId(coupon.stripeData.couponId);
                      setShowPromoModal(true);
                    }}
                    startIcon={<Add />}
                    sx={{ mt: 2 }}
                  >
                    Add Promotion Code
                  </Button>

                  {coupon.promotionCodes.length > 0 ? (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Promotion Codes
                      </Typography>
                      {coupon.promotionCodes.map((promo, promoIndex) => (
                        <PromotionCodeList key={promo._id} promo={promo} />
                      ))}
                    </Box>
                  ) : (
                    <Typography
                      variant="subtitle2"
                      color="info"
                      sx={{ fontStyle: "italic" }}
                    >
                      Create at least one customer-facing promo code to allow
                      customers to use coupons.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <EmptyState message="No coupon added" />
        )}
      </Stack>

      <ModalBox
        title="New Promotion Code"
        open={showPromoModal}
        onClose={() => setShowPromoModal(false)}
      >
        <AddPromotionCode
          onClose={() => setShowPromoModal(false)}
          selectedCoupon={selectedCoupon}
          selectedCouponStripeId={selectedCouponStripeId}
        />
      </ModalBox>
    </>
  );
}

export default Coupons;
