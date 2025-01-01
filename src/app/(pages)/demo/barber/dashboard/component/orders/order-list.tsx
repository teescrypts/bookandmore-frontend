"use client";

import React from "react";
import { CustomerOrderType } from "../../orders/page";
import OrderDetails from "./orders-details";
import EmptyState from "@/components/empty-state";

function OrderList({ orders }: { orders: CustomerOrderType[] }) {
  return orders.length > 0 ? (
    orders.map((order) => <OrderDetails order={order} />)
  ) : (
    <EmptyState message="You do not have any order" />
  );
}

export default OrderList;
