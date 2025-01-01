import PropTypes from "prop-types";
import { format } from "date-fns";
import numeral from "numeral";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { SeverityPill } from "@/components/severity-pill";
import { OrderType } from "../../orders/page";

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
  complete: "success",
  pending: "info",
  canceled: "warning",
  rejected: "error",
};

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
}

type PropTypes = {
  count: number;
  items: OrderType[];
  onPageChange: (e: any, page: number) => void;
  onRowsPerPageChange: (e: any) => void;
  onSelect: (orderId: string) => void;
  page: number;
  rowsPerPage: number;
};

export const OrderListTable = (props: PropTypes) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelect,
    page = 0,
    rowsPerPage = 0,
  } = props;

  return (
    <div>
      <Table>
        <TableBody>
          {items.map((order) => {
            const createdAtMonth = format(order.createdAt, "LLL").toUpperCase();
            const createdAtDay = format(order.createdAt, "d");
            const totalAmount = numeral(order.totalAmount).format(
              `${"usd"}0,0.00`
            );
            const statusColor = statusMap[order.status] || "warning";

            return (
              <TableRow
                hover
                key={order._id}
                onClick={() => onSelect?.(order._id)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "neutral.800"
                          : "neutral.200",
                      borderRadius: 2,
                      maxWidth: "fit-content",
                      ml: 3,
                      p: 1,
                    }}
                  >
                    <Typography align="center" variant="subtitle2">
                      {createdAtMonth}
                    </Typography>
                    <Typography align="center" variant="h6">
                      {createdAtDay}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle2">{order._id}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      Total of {totalAmount}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <SeverityPill color={statusColor}>
                    {order.status}
                  </SeverityPill>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};
