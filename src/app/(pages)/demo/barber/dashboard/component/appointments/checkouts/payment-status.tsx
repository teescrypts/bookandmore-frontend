import notify from "@/utils/toast";
import { useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useRef } from "react";

function PaymntStatus() {
  const stripe = useStripe();
  const ref = useRef(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (ref.current) return;

    // Retrieve the "payment_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (clientSecret) {
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        if (paymentIntent) {
          switch (paymentIntent.status) {
            case "succeeded":
              notify("Success! Payment received.");
              break;

            case "processing":
              notify(
                "Payment processing. We'll update you when payment is received."
              );
              break;

            case "requires_payment_method":
              // Redirect your user back to your payment page to attempt collecting
              // payment again
              notify("Payment failed. Please try another payment method.");
              break;

            default:
              notify("Something went wrong.");
              break;
          }
        }
      });
    }

    ref.current = true;
  }, [stripe]);

  return <></>;
}

export default PaymntStatus;
