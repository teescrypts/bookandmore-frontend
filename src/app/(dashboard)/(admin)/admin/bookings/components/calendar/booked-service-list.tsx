import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Chip,
  Button,
} from "@mui/material";

// Example data structure for each service booking
type ServiceBooking = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  loyaltyPoints?: number; // Optional field, only available if enabled
  services: {
    serviceName: string;
    addons: string[];
    price: number;
  }[];
  isHomeService: boolean;
  paymentStatus: "no payment" | "deposit made" | "full payment";
  id: string; // Assuming each booking has a unique ID for cancellation
};

type Props = {
  bookings: ServiceBooking[];
  showLoyaltyPoints: boolean;
  onCancel: (id: string) => void; // Function to handle canceling an appointment
};

export default function BookedServicesList({
  bookings,
  showLoyaltyPoints,
  onCancel,
}: Props) {
  return (
    <Box>
      {bookings.map((booking, index) => (
        <Card key={index} sx={{ mb: 3 }}>
          <CardContent>
            {/* Customer Details */}
            <Typography variant="h6" gutterBottom>
              Customer: {booking.customerName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Email: {booking.customerEmail}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Phone: {booking.customerPhone}
            </Typography>

            {/* Loyalty Points (Optional) */}
            {showLoyaltyPoints && booking.loyaltyPoints !== undefined && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Loyalty Points: {booking.loyaltyPoints}
              </Typography>
            )}

            {/* Service Details */}
            <Box mt={2}>
              <Typography variant="h6" gutterBottom>
                Services Booked:
              </Typography>
              <Stack spacing={2}>
                {booking.services.map((service, idx) => (
                  <Box key={idx}>
                    <Typography variant="subtitle1">
                      {service.serviceName} - ${service.price}
                    </Typography>
                    {service.addons.length > 0 && (
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {service.addons.map((addon, addonIndex) => (
                          <Chip key={addonIndex} label={addon} size="small" />
                        ))}
                      </Stack>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Service Type (Home/Shop) */}
            <Typography variant="body2" color="textSecondary">
              Service Type:{" "}
              <strong>
                {booking.isHomeService ? "Home Service" : "In-shop"}
              </strong>
            </Typography>

            {/* Payment Status */}
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Payment Status:{" "}
              <Chip
                label={booking.paymentStatus}
                color={
                  booking.paymentStatus === "no payment"
                    ? "error"
                    : booking.paymentStatus === "deposit made"
                    ? "warning"
                    : "success"
                }
                size="small"
              />
            </Typography>

            {/* Cancel Appointment Button */}
            <Box sx={{ mt: 2, textAlign: "right" }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => onCancel(booking.id)}
              >
                Cancel Appointment
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
