"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Chip,
  Tooltip,
  IconButton,
  Snackbar,
  Alert,
  Stack,
  CircularProgress,
} from "@mui/material";
import Copy from "@/icons/untitled-ui/duocolor/copy";
import Share07 from "@/icons/untitled-ui/duocolor/share-07";
import Loyalty from "@/icons/untitled-ui/duocolor/loyalty";
import CheckCircle from "@/icons/untitled-ui/duocolor/checked-circle";
import {
  ActivePromoCode,
  CustomerInfoPoints,
  CustomerLoyaltyPointsSettings,
} from "../../loyalty-point/page";
import {
  generateReferralCode,
  redeemLoyaltyPoint,
} from "@/app/actions/actions";
import notify from "@/utils/toast";

interface Props {
  settings: CustomerLoyaltyPointsSettings;
  customerInfo: CustomerInfoPoints;
  activePromoCode: ActivePromoCode | null;
}

const LoyaltyPointsInfo: React.FC<Props> = ({
  settings,
  customerInfo,
  activePromoCode,
}) => {
  const [code, setCode] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMesage] = useState("");

  useEffect(() => {
    if (customerInfo) {
      setCode(customerInfo.referralCode?.value);
    }
  }, [settings, customerInfo]);

  const handleGenerateCode = async () => {
    setGenerating(true);
    try {
      const result = await generateReferralCode();

      if (result?.error) {
        setMesage(result.error);
        setGenerating(false);
      }
      if (result?.success) {
        notify("Referral code generated");
        setGenerating(false);
      }
    } catch (e) {
      setGenerating(false);
      throw new Error("Internal server error. Please refresh");
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code!);
    setCopied(true);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleRedeem = async () => {
    const result = await redeemLoyaltyPoint();

    if (result?.error) setMesage(result.error);
    if (result?.success) notify(result.success);
  };

  return (
    <Stack spacing={2}>
      <Card sx={{ maxWidth: 800, mx: "auto", my: 4, p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Loyalty Points Program
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle2" color="error" textAlign={"center"}>
            {message}
          </Typography>

          {settings.active ? (
            <Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Take advantage of our loyalty points program! Every dollar spent
                earns you points that can be redeemed for discounts.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                <strong>Monetary Equivalent:</strong> 1 point = $
                {settings.monetaryEquivalent.toFixed(2)}
              </Typography>

              {/* Referral Program */}
              {settings.enableReferral && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Referral Program
                  </Typography>
                  {code ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip label={`Referral Code: ${code}`} />
                      <Tooltip title="Copy Code">
                        <IconButton onClick={handleCopyCode}>
                          <Copy />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Share07 />}
                      onClick={handleGenerateCode}
                      sx={{ minWidth: 350 }}
                    >
                      {generating ? (
                        <CircularProgress />
                      ) : (
                        "Generate Referral Code"
                      )}
                    </Button>
                  )}
                </Box>
              )}

              {/* Appointment Settings */}
              {settings.enableAppointment && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Earn Points on Appointments
                  </Typography>
                  <Typography variant="body2">
                    {settings.minimumAmountEnabledApt
                      ? `Earn points when you spend at least $${settings.minimumAmountApt?.toFixed(
                          2
                        )} on appointments.`
                      : "Earn points on all appointments."}
                  </Typography>

                  {settings?.appliesToApt &&
                    settings.aptServiceIds!.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" fontWeight="bold">
                          Eligible Services:
                        </Typography>
                        <List>
                          {settings.aptServiceIds!.map((service) => (
                            <ListItem key={service.id}>
                              <ListItemIcon>
                                <CheckCircle color="success" />
                              </ListItemIcon>
                              <ListItemText primary={service.name} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                </Box>
              )}

              {/* Product Purchase Settings */}
              {settings.enableProduct && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Earn Points on Products
                  </Typography>
                  <Typography variant="body2">
                    {settings.minimumAmountEnabledProd
                      ? `Earn points when you spend at least $${settings.minimumAmountProd?.toFixed(
                          2
                        )} on products.`
                      : "Earn points on all product purchases."}
                  </Typography>

                  {settings.appliesToProd &&
                    settings.prodServiceIds!.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" fontWeight="bold">
                          Eligible Products:
                        </Typography>
                        <List>
                          {settings.prodServiceIds!.map((product) => (
                            <ListItem key={product.id}>
                              <ListItemIcon>
                                <Loyalty color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={product.name} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                </Box>
              )}
            </Box>
          ) : (
            <Typography variant="body1" color="error">
              The loyalty points program is currently inactive.
            </Typography>
          )}
        </CardContent>

        {/* Snackbar for Copy Notification */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            Referral code copied to clipboard!
          </Alert>
        </Snackbar>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">Total Loyalty Points</Typography>
          <Typography variant="h4" color="primary" sx={{ mt: 1 }}>
            {Number(customerInfo?.loyaltyPoint?.total || 0) -
              Number(customerInfo?.loyaltyPoint?.redeemed || 0)}
          </Typography>
          {activePromoCode && (
            <Typography variant="subtitle1">
              Active Promo Code: {activePromoCode.code} (
              {activePromoCode.coupon.value} USD)
            </Typography>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRedeem}
              disabled={
                Number(customerInfo?.loyaltyPoint?.total || 0) -
                  Number(customerInfo?.loyaltyPoint?.redeemed || 0) <=
                0
              }
            >
              Redeem Points
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default LoyaltyPointsInfo;
