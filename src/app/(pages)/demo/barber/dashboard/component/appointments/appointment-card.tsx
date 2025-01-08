import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Box,
  Grid2,
  Chip,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { CustomerAppointmentType } from "./appointment-page";
import formatDate from "@/utils/format-date";
import formatDateToReadable from "@/utils/format-date-to-readable";
import { convertToAmPmFormat } from "@/utils/convert-to-am-pm";
import {
  applyCoupon,
  cancelAppointment,
  checkAppointmentAction,
  payForAppointment,
} from "@/app/actions/actions";
import { useEffect, useState } from "react";
import ModalBox from "@/components/modal";
import Close from "@/icons/untitled-ui/duocolor/close";
import Payment from "@/icons/untitled-ui/duocolor/payment";
import notify from "@/utils/toast";
import LocalOffer from "@/icons/untitled-ui/duocolor/local-offer";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkouts/checkout-form";
import PaymntStatus from "./checkouts/payment-status";

const stripePromise = loadStripe(
  "pk_test_51Pf9jVA9UXNeDBeWlIu4aYKO1FP8VOxzBs0ah0Q6Dt7lCHwxCzR8gj2ODaFIteFleKNz2dMbCjDoBxEFBPwRlJIl00Rk8ORztX"
);

const AppointmentCard: React.FC<{ appointment: CustomerAppointmentType }> = ({
  appointment,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [serviceFee, setServiceFee] = useState<number>();
  const [amountTax, setAmountTax] = useState<number>();
  const [taxRate, setTaxRate] = useState<number>();
  const [discount, setDiscount] = useState<{
    value: number;
    couponId: string;
  }>();
  const [total, setTotal] = useState<number>();

  const { service, staff, date, bookedTime, actions, policy, price } =
    appointment;

  useEffect(() => {
    setServiceFee(price.serviceFee);
    setTaxRate(price.taxRate);
    setAmountTax(price.tax);
    setTotal(price.total);
  }, [appointment]);

  useEffect(() => {
    if (serviceFee && discount) {
      const discountServiceFee = serviceFee - discount.value;

      let newTax = 0;
      if (taxRate && taxRate > 0) {
        newTax = Number(((taxRate / 100) * discountServiceFee).toFixed(2));
        setAmountTax(newTax);
      }

      const newTotal = discountServiceFee + newTax;
      setTotal(newTotal);
    }
  }, [discount]);

  const [clientSecret, seetClientSecret] = useState<string>();
  const [openPay, setOpenPay] = useState(false);
  const handleOpenPayOpen = () => setOpenPay(true);
  const handleOpenPayClose = () => setOpenPay(false);

  const handlePayNow = async () => {
    const result = await payForAppointment(appointment._id, discount?.couponId);

    if (result?.error) setErrMsg(result.error);
    if (result?.success) {
      seetClientSecret(result.success);
      handleOpenPayOpen();
    }
  };

  const options = { clientSecret };

  const [message, setMessage] = useState("");
  const [condition, setCondition] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [charge, setCharge] = useState(false);

  const [openCancel, setOpenCancel] = useState(false);
  const handleOpenCancel = () => setOpenCancel(true);
  const handleCloseCancel = () => setOpenCancel(false);

  const handleCheckAction = async (window?: number) => {
    setLoading(true);
    if (policy.cancelFee.enabled && window) {
      try {
        const data = {
          window,
          fee: policy.cancelFee.fee!,
          branch: appointment.branch._id,
          bookedTime: bookedTime.from,
          bookedDate: date,
        };
        const result = await checkAppointmentAction(data);

        if (result?.error) {
          setMessage(result.error);
          setLoading(false);
        }
        if (result?.success) {
          setCondition(result.success.condition);
          setCharge(result.success.charge);
          handleOpenCancel();
          setLoading(false);
        }
      } catch {
        throw new Error("Internal server error. Please refresh");
      }
    } else {
      setCondition(
        "You're about to cancel your appointment. This action cannot be undone."
      );
      handleOpenCancel();
      setLoading(false);
    }
  };

  const handleCancelApt = async () => {
    setLoadingCancel(true);
    const result = await cancelAppointment(
      charge,
      appointment._id,
      appointment.branch._id,
      appointment.bookedTime.from,
      appointment.date,
      appointment.policy.cancelFee.enabled,
      appointment.policy.cancelFee?.window,
      appointment.policy.cancelFee.fee
    );

    if (result?.error) {
      setMessage(result.error);
      handleCloseCancel();
      setLoadingCancel(false);
    }

    if (result?.success) {
      notify(result.success);
      handleCloseCancel();
      setLoadingCancel(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (couponCode) {
      setLoadingCoupon(true);
      const result = await applyCoupon(
        couponCode,
        appointment.price.serviceFee,
        appointment.branch._id,
        appointment.service._id
      );

      if (result?.error) {
        setErrMsg(result.error);
        setLoadingCoupon(false);
      }
      if (result?.success) {
        setDiscount({
          value: result.success.discount,
          couponId: result.success.coupondId,
        });
        setLoadingCoupon(false);
      }
    }
  };

  return (
    <>
      <Elements stripe={stripePromise} options={options}>
        <PaymntStatus />
      </Elements>
      <Card variant="outlined" sx={{ mb: 4, borderRadius: 4, boxShadow: 3 }}>
        <CardContent>
          {/* Header */}
          <Box
            sx={{
              textAlign: "center",
              mb: 4,
              backgroundColor: "primary.main",
              color: "white",
              py: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              {service.name}
            </Typography>
            <Typography variant="body1">{service.description}</Typography>
          </Box>

          {/* Appointment Info */}
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Appointment Details
                </Typography>
                <Typography variant="body2">
                  <strong>Branch:</strong> {appointment.branch.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Staff:</strong> {`${staff.fname} ${staff.lname}`} (
                  {staff.email})
                </Typography>
                <Typography variant="body2">
                  <strong>Date:</strong> {formatDateToReadable(date)}
                </Typography>
                <Typography variant="body2">
                  <strong>Time:</strong>{" "}
                  {`${convertToAmPmFormat(
                    bookedTime.from
                  )} - ${convertToAmPmFormat(bookedTime.to)}`}
                </Typography>
              </Box>
            </Grid2>

            {/* Price Info */}
            {total && (
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Pricing
                  </Typography>
                  <Typography variant="body2">
                    <strong>Service Fee:</strong> ${serviceFee}
                  </Typography>
                  {discount?.value && discount.value > 0 && (
                    <Typography variant="body2">
                      <strong>Discount:</strong> - ${discount.value}
                    </Typography>
                  )}
                  {typeof amountTax === "number" && (
                    <Typography variant="body2">
                      <strong>Tax:</strong> ${amountTax}
                    </Typography>
                  )}

                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight="bold"
                    sx={{ mt: 1 }}
                  >
                    <strong>Total:</strong> ${total}
                  </Typography>
                </Box>
              </Grid2>
            )}
          </Grid2>

          {/* Coupon Field */}
          {!discount && actions.payable && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Apply Coupon
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter coupon code"
                size="small"
                sx={{ mt: 1 }}
                onChange={(e) => setCouponCode(e.target.value)}
                value={couponCode}
              />
              <Typography variant="body2" color="error">
                {errMsg}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleApplyCoupon}
                sx={{ mt: 2 }}
                fullWidth
                disabled={loadingCoupon}
              >
                {loadingCoupon ? <CircularProgress /> : "Apply Code"}
              </Button>
            </Box>
          )}

          {discount && discount.value > 0 && couponCode && (
            <Chip
              icon={<LocalOffer />}
              label={couponCode.toUpperCase()}
              onDelete={() => {
                setDiscount(undefined);
                setCouponCode("");
              }}
              deleteIcon={
                <IconButton>
                  <Close />
                </IconButton>
              }
              color="primary"
              variant="outlined"
              sx={{
                border: "1px solid",
                fontWeight: "bold",
                padding: "0.2rem",
              }}
            />
          )}

          {/* Policy Info */}
          <Box
            sx={{
              mt: 4,
              p: 2,
              backgroundColor: "#f4f6f8",
              borderRadius: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              Policies
            </Typography>
            <Typography variant="body2">
              <strong>Cancellation Fee:</strong>{" "}
              {policy.cancelFee.enabled
                ? `$${policy.cancelFee.fee} (within ${policy.cancelFee.window} hours)`
                : "No Cancellation Fee"}
            </Typography>
            <Typography variant="body2">
              <strong>No-Show Fee:</strong>{" "}
              {policy.noShowFee.enabled
                ? `$${policy.noShowFee.fee}`
                : "No No-Show Fee"}
            </Typography>
          </Box>

          <Typography
            textAlign="center"
            variant="body2"
            color="error"
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>

          {/* Action Buttons */}
          <Stack
            direction="row"
            spacing={2}
            mt={4}
            justifyContent="center"
            alignItems="center"
          >
            {actions.cancellable && (
              <Button
                variant="contained"
                color="error"
                onClick={() => handleCheckAction(policy.cancelFee?.window)}
                disabled={loading}
                startIcon={<Close />}
              >
                Cancel
              </Button>
            )}

            {actions.payable && (
              <Button
                variant="contained"
                color="success"
                onClick={handlePayNow}
                startIcon={<Payment />}
              >
                Pay Now
              </Button>
            )}

            {["completed", "cancelled"].includes(appointment.status) && (
              <Chip label={appointment.status} color="default" />
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Modal for Cancellation */}
      <ModalBox open={openCancel} onClose={handleCloseCancel}>
        <Stack justifyContent="center" spacing={3}>
          <Typography textAlign="center" variant="h6">
            {condition}
          </Typography>
          <Typography textAlign="center" variant="body1">
            Are you sure you want to cancel this appointment?
          </Typography>
          <Button
            disabled={loadingCancel}
            onClick={handleCancelApt}
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
          >
            Confirm Cancellation
          </Button>
        </Stack>
      </ModalBox>

      <ModalBox open={openPay} onClose={handleOpenPayClose}>
        {options?.clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        ) : (
          <Stack direction={"row"} justifyContent={"center"}>
            <CircularProgress />
          </Stack>
        )}
      </ModalBox>
    </>
  );
};

export default AppointmentCard;
