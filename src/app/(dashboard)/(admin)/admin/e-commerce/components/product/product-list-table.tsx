import { Fragment, useCallback, useState } from "react";
import numeral from "numeral";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Scrollbar } from "@/components/scrollbar";
import { SeverityPill } from "@/components/severity-pill";
import Edit from "@/icons/untitled-ui/duocolor/edit";
import Pause from "@/icons/untitled-ui/duocolor/pause";
import Delete from "@/icons/untitled-ui/duocolor/delete";
import Link from "next/link";
import { adminPaths, API_BASE_URL } from "@/paths";
import Copy from "@/icons/untitled-ui/duocolor/copy";
import { Tooltip } from "@mui/material";
import { Product } from "../../products/page";
import { deleteProduct } from "@/app/actions/actions";
import notify from "@/utils/toast";

interface ProductListTableProps {
  count: number;
  items: Product[];
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
}

export const ProductListTable: React.FC<ProductListTableProps> = ({
  count = 0,
  items = [],
  onPageChange = () => {},
  onRowsPerPageChange,
  page = 0,
  rowsPerPage = 0,
}) => {
  const [message, setMessage] = useState("");
  const handleProductDelete = useCallback(async (id: string) => {
    const result = await deleteProduct(id);

    if (result?.error) setMessage(result.error);
    if (result?.success) notify(result.success);
  }, []);

  return (
    <div>
      <Typography variant="subtitle2" color="error" textAlign={"center"}>
        {message}
      </Typography>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell align="center">Price</TableCell>
              {/* <TableCell align="center">DISCOUNT</TableCell> */}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((product) => {
              const hasManySizes = product.sizeBasedQuantity?.enabled;
              const sizeBasedTotal = () => {
                const total = product
                  .sizeBasedQuantity!.details!.map((detail) => {
                    return detail.quantity;
                  })
                  .reduce((a, b) => a + b);

                return total;
              };

              const totalQty = product.sizeBasedQuantity?.enabled
                ? sizeBasedTotal()
                : product.quantity;

              const quantityColor = totalQty >= 5 ? "success" : "error";

              return (
                <Fragment key={product._id}>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ alignItems: "center", display: "flex" }}>
                        <Box
                          sx={{
                            alignItems: "center",
                            backgroundColor: "neutral.50",
                            backgroundImage: `url(${product.images[0].url})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            borderRadius: 1,
                            display: "flex",
                            height: 80,
                            justifyContent: "center",
                            overflow: "hidden",
                            width: 80,
                          }}
                        />
                        <Box sx={{ cursor: "pointer", ml: 2 }}>
                          <Typography variant="subtitle2">
                            {product.name}
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            in {product.category.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <LinearProgress
                        value={totalQty}
                        variant="determinate"
                        color={quantityColor}
                        sx={{ height: 8, width: 36 }}
                      />
                      <Typography color="text.secondary" variant="body2">
                        {totalQty} of 100 in stock
                        {hasManySizes &&
                          ` in ${product.sizeBasedQuantity?.details?.length} sizes`}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">$ {product.price}</TableCell>
                    {/* <TableCell align="center">{product.discount}%</TableCell> */}
                    <TableCell align="right">
                      <Link
                        href={`${adminPaths.dashboard.ecommerce.products}/${product._id}`}
                      >
                        <IconButton>
                          <SvgIcon>
                            <Edit />
                          </SvgIcon>
                        </IconButton>
                      </Link>

                      <IconButton
                        onClick={() => handleProductDelete(product._id)}
                      >
                        <SvgIcon color="error">
                          <Delete />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
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
