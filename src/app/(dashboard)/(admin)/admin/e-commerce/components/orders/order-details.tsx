import { format } from "date-fns";
import numeral from "numeral";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material";
import Edit from "@/icons/untitled-ui/duocolor/edit";
import { PropertyList } from "@/components/property-list";
import PropertyListItem from "@/components/property-list-item";
import { Scrollbar } from "@/components/scrollbar";
import { SeverityPill } from "@/components/severity-pill";
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
  promotionCode?: string;
  id: string;
  createdAt: number;
  currency: string;
  customer: Customer;
  items: Item[];
  number: string;
  paymentMethod: string;
  status: string;
  totalAmount: number;
}

type PropTypes = {
  onApprove: () => void;
  onEdit: () => void;
  onReject: () => void;
  order: OrderType;
};

type StatusMap = {
  [key: string]:
    | "warning"
    | "success"
    | "info"
    | "error"
    | "primary"
    | "secondary";
};

const statusMap: StatusMap = {
  canceled: "warning",
  complete: "success",
  pending: "info",
  rejected: "error",
};

export const OrderDetails = (props: PropTypes) => {
  const { onApprove, onEdit, onReject, order } = props;
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  const align = lgUp ? "horizontal" : "vertical";
  const items = order.products || [];
  const createdAt = format(order.createdAt, "dd/MM/yyyy HH:mm");
  const statusColor = statusMap[order.status];
  const totalAmount = numeral(order.totalAmount).format(`${"usd"}0,0.00`);
  const shippingAddress = order.shippingAddress;

  return (
    <Stack spacing={6}>
      <Stack spacing={3}>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Typography variant="h6">Details</Typography>
          <Button
            color="inherit"
            onClick={onEdit}
            size="small"
            startIcon={
              <SvgIcon>
                <Edit />
              </SvgIcon>
            }
          >
            Edit
          </Button>
        </Stack>
        <PropertyList>
          {/* <PropertyListItem
            align={align}
            disableGutters
            divider
            label="ID"
            value={order._id}
          /> */}
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Number"
            value={order._id}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Customer"
          >
            <Typography color="text.secondary" variant="body2">
              {`${order.customer.fname} ${order.customer.lname}`}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {shippingAddress.line1}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {shippingAddress.state}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {shippingAddress.city}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {shippingAddress.country}
            </Typography>
          </PropertyListItem>
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Date"
            value={createdAt}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Shipping cost"
            value={`${order.totalShipping} USD`}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Discount"
            value={`- ${order.totalDiscount} USD`}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Tax"
            value={`${order.totalTax} USD`}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Total Amount"
            value={`${order.totalAmount} USD`}
          />
          <PropertyListItem align={align} disableGutters divider label="Status">
            <SeverityPill color={statusColor}>{order.status}</SeverityPill>
          </PropertyListItem>
        </PropertyList>
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          justifyContent="flex-end"
          spacing={2}
        >
          <Button onClick={onApprove} size="small" variant="contained">
            Approve
          </Button>
          <Button
            color="error"
            onClick={onReject}
            size="small"
            variant="outlined"
          >
            Reject
          </Button>
        </Stack>
      </Stack>
      <Stack spacing={3}>
        <Typography variant="h6">Line items</Typography>
        <Scrollbar>
          <Table sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => {
                const unitAmount = numeral(item.price).format(`${"usd"}0,0.00`);

                return (
                  <TableRow key={`${item.product._id}-${index}`}>
                    <TableCell>
                      {item.product.name} x {item.quantity}
                    </TableCell>
                    <TableCell>{item?.size ? item.size : "NIL"}</TableCell>
                    <TableCell>{`${unitAmount} USD`}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Scrollbar>
      </Stack>
    </Stack>
  );
};
