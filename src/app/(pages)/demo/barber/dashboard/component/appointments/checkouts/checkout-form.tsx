import { CLIENT_BASE_URL } from "@/paths";
import notify from "@/utils/toast";
import { Button, CircularProgress, Typography } from "@mui/material";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { FormEvent, FormEventHandler, useEffect, useState } from "react";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${CLIENT_BASE_URL}/demo/barber/dashboard/appointments`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {errorMessage && (
        <Typography color="error" textAlign={"center"} variant="subtitle2">
          {errorMessage}
        </Typography>
      )}
      <Button
        type="submit"
        sx={{ my: 2 }}
        fullWidth
        variant="contained"
        disabled={!stripe || loading}
      >
        {loading ? <CircularProgress /> : "Submit"}
      </Button>
    </form>
  );
}

export default CheckoutForm;
