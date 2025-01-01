import { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material";
import Close from "@/icons/untitled-ui/duocolor/close";
import { OrderDetails } from "./order-details";
import { OrderEdit } from "./order-eedit";
import { OrderType } from "../../orders/page";

interface Customer {
  address1: string;
  address2: string;
  city: string;
  country: string;
  email: string;
  name: string;
}

interface Item {
  id: string;
  billingCycle: string;
  currency: string;
  name: string;
  quantity: number;
  unitAmount: number;
}

interface Order {
  id: string;
  createdAt: number;
  currency: string;
  customer: Customer;
  items: Item[];
  number: string;
  paymentMethod: string;
  status: string;
  totalAmount: number;
  promotionCode?: string;
}

type PropTypes = {
  container: HTMLElement | null;
  onClose: () => void;
  open: boolean;
  order?: OrderType;
};

export const OrderDrawer = (props: PropTypes) => {
  const { container, onClose, open, order } = props;
  const [isEditing, setIsEditing] = useState(false);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  const handleEditOpen = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  let content = null;

  if (order) {
    content = (
      <div>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{
            px: 3,
            py: 2,
          }}
        >
          <Typography color="inherit" variant="h6">
            {order._id}
          </Typography>
          <IconButton color="inherit" onClick={onClose}>
            <SvgIcon>
              <Close />
            </SvgIcon>
          </IconButton>
        </Stack>
        <Box
          sx={{
            px: 3,
            py: 4,
          }}
        >
          {!isEditing ? (
            <OrderDetails
              onApprove={onClose}
              onEdit={handleEditOpen}
              onReject={onClose}
              order={order}
            />
          ) : (
            <OrderEdit
              onCancel={handleEditCancel}
              onSave={handleEditCancel}
              order={order}
            />
          )}
        </Box>
      </div>
    );
  }

  if (lgUp) {
    return (
      <Drawer
        anchor="right"
        open={open}
        PaperProps={{
          sx: {
            position: "relative",
            width: 500,
          },
        }}
        SlideProps={{ container }}
        variant="persistent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      hideBackdrop
      ModalProps={{
        container,
        sx: {
          pointerEvents: "none",
          position: "absolute",
        },
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          maxWidth: "100%",
          width: 400,
          pointerEvents: "auto",
          position: "absolute",
        },
      }}
      SlideProps={{ container }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};
