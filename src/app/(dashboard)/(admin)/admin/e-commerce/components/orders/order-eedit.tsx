import { format } from "date-fns";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { OrderType } from "../../orders/page";
import { SubmitButton } from "@/components/submit-button";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { updateOrderStatus } from "@/app/actions/actions";
import notify from "@/utils/toast";

const statusOptions = [
  {
    label: "Processing",
    value: "processing",
  },
  {
    label: "Shipped",
    value: "shipped",
  },
  {
    label: "Delivered",
    value: "delivered",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];

const initialState: { error?: string; success?: string } | null = null;

export const OrderEdit = (props: {
  onCancel: () => void;
  onSave: () => void;
  order: OrderType;
}) => {
  const { onCancel, onSave, order } = props;

  const createdAt = format(order.createdAt, "dd/MM/yyyy HH:mm");
  const shippingAddress = order.shippingAddress;

  const [message, setMessage] = useState("");
  const [state, formAction] = useFormState(updateOrderStatus, initialState);

  useEffect(() => {
    if (state?.error) setMessage(state.error);
    if (state?.success) notify(state.success);
  }, [state]);

  return (
    <form action={formAction}>
      <Stack spacing={6}>
        <Stack spacing={3}>
          <Typography variant="h6">Details</Typography>
          <Stack spacing={3}>
            {/* <TextField
              variant="outlined"
              disabled
              fullWidth
              label="ID"
              name="id"
              value={order._id}
            /> */}
            <TextField
              variant="outlined"
              disabled
              fullWidth
              label="Number"
              name="number"
              defaultValue={order._id}
            />
            <input name="id" defaultValue={order._id} hidden />
            <TextField
              variant="outlined"
              disabled
              fullWidth
              label="Customer name"
              name="customer_name"
              defaultValue={`${order.customer.fname} ${order.customer.lname}`}
            />
            <TextField
              variant="outlined"
              disabled
              fullWidth
              label="Date"
              name="date"
              defaultValue={createdAt}
            />
            <TextField
              variant="outlined"
              disabled
              fullWidth
              label="Total Amount"
              name="amount"
              defaultValue={order.totalAmount}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Address"
              name="line1"
              defaultValue={shippingAddress.line1}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Country"
              name="country"
              defaultValue={shippingAddress.country}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="State/Region"
              name="state"
              defaultValue={shippingAddress.state}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="City"
              name="city"
              defaultValue={shippingAddress.city}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Postal code"
              name="postal_code"
              defaultValue={shippingAddress.postal_code}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Status"
              name="status"
              select
              slotProps={{ select: { native: true } }}
              defaultValue={order.status}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Stack>

          <Typography
            variant="subtitle2"
            textAlign={"center"}
            color="error"
            sx={{ my: 2 }}
          >
            {message}
          </Typography>
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            spacing={2}
          >
            <SubmitButton title="Save Changes" isFullWidth={false} />
            <Button color="inherit" onClick={onCancel} size="small">
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
};
