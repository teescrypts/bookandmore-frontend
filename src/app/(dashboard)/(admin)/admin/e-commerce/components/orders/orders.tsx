"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ordersApi } from "./utils/ordersApi";
import { useDialog } from "@/app/(dashboard)/hooks/use-dialog";
import {
  Box,
  Button,
  Divider,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { OrderDrawer } from "./order-drawer";
import { OrderListContainer } from "./order-list-container";
import { OrderListTable } from "./order-list-table";
import Add from "@/icons/untitled-ui/duocolor/add";
import { OrderListSearch } from "./order-list-search";
import { useMounted } from "@/hooks/use-Mounted";
import { OrderType } from "../../orders/page";
import EmptyState from "@/components/empty-state";

type Filters = { query: string | undefined; status: string | undefined };
type SearchType = {
  filters: Filters;
  page: number;
  rowsPerPage: number;
  sortBy: keyof OrderType;
  sortDir: "asc" | "desc";
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
  promotionCode?: string;
}

const useOrdersSearch = () => {
  const [state, setState] = useState<SearchType>({
    filters: {
      query: undefined,
      status: undefined,
    },
    page: 0,
    rowsPerPage: 5,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  const handleFiltersChange = useCallback((filters: Filters) => {
    setState((prevState) => ({
      ...prevState,
      filters,
    }));
  }, []);

  const handleSortChange = useCallback((sortDir: "asc" | "desc") => {
    setState((prevState) => ({
      ...prevState,
      sortDir,
    }));
  }, []);

  const handlePageChange = useCallback((event: any, page: number) => {
    setState((prevState) => ({
      ...prevState,
      page,
    }));
  }, []);

  const handleRowsPerPageChange = useCallback((event: any) => {
    setState((prevState) => ({
      ...prevState,
      rowsPerPage: parseInt(event.target.value, 10),
    }));
  }, []);

  return {
    handleFiltersChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    state,
  };
};

const useOrdersStore = (searchState: SearchType, orders?: OrderType[]) => {
  const isMounted = useMounted();
  const [state, setState] = useState<{
    orders: OrderType[];
    ordersCount: number;
  }>({
    orders: [],
    ordersCount: 0,
  });

  const handleOrdersGet = useCallback(async () => {

    try {
      const response = await ordersApi.getOrders(searchState, orders!);

      if (isMounted()) {
        setState({
          orders: response.data,
          ordersCount: response.count,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [searchState, isMounted, orders]);

  useEffect(
    () => {
      if (orders && orders.length > 0) {
        handleOrdersGet();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchState, orders]
  );

  return {
    ...state,
  };
};

const useCurrentOrder = (orders: OrderType[], orderId?: string) => {
  return useMemo(() => {
    if (!orderId) {
      return undefined;
    }

    return orders.find((order) => order._id === orderId);
  }, [orders, orderId]);
};

function Orders({ orders }: { orders: OrderType[] }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [currentOrders, setCurrentOrders] = useState<OrderType[] | undefined>();
  const ordersSearch = useOrdersSearch();
  const ordersStore = useOrdersStore(ordersSearch.state, currentOrders);
  const dialog = useDialog();
  const currentOrder = useCurrentOrder(
    ordersStore.orders,
    dialog.data as string
  );

  useEffect(() => {
    setCurrentOrders(orders);
  }, [orders]);

  const handleOrderOpen = useCallback(
    (orderId: string) => {
      // Close drawer if is the same order

      if (dialog.open && dialog.data === orderId) {
        dialog.handleClose();
        return;
      }

      dialog.handleOpen(orderId);
    },
    [dialog]
  );

  return (
    <>
      <Divider />
      {currentOrders && currentOrders.length > 0 ? (
        <Box
          component="main"
          ref={rootRef}
          sx={{
            display: "flex",
            flex: "1 1 auto",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            ref={rootRef}
            sx={{
              bottom: 0,
              display: "flex",
              left: 0,
              position: "relative",
              right: 0,
              top: 0,
              width: "100vw",
            }}
          >
            <OrderListContainer open={dialog.open}>
              <Box sx={{ p: 3 }}>
                <Stack
                  alignItems="flex-start"
                  direction="row"
                  justifyContent="space-between"
                  spacing={4}
                >
                  <div>
                    <Typography variant="h4">Orders</Typography>
                  </div>
                  {/* <div>
                  <Button
                    startIcon={
                      <SvgIcon>
                        <Add />
                      </SvgIcon>
                    }
                    variant="contained"
                  >
                    Add
                  </Button>
                </div> */}
                </Stack>
              </Box>
              <Divider />
              <OrderListSearch
                onFiltersChange={ordersSearch.handleFiltersChange}
                onSortChange={ordersSearch.handleSortChange}
                sortBy={ordersSearch.state.sortBy}
                sortDir={ordersSearch.state.sortDir}
              />
              <Divider />
              <OrderListTable
                count={ordersStore.ordersCount}
                items={ordersStore.orders}
                onPageChange={ordersSearch.handlePageChange}
                onRowsPerPageChange={ordersSearch.handleRowsPerPageChange}
                onSelect={handleOrderOpen}
                page={ordersSearch.state.page}
                rowsPerPage={ordersSearch.state.rowsPerPage}
              />
            </OrderListContainer>
            <OrderDrawer
              container={rootRef.current}
              onClose={dialog.handleClose}
              open={dialog.open}
              order={currentOrder}
            />
          </Box>
        </Box>
      ) : (
        <EmptyState message="No orders" />
      )}
    </>
  );
}

export default Orders;
