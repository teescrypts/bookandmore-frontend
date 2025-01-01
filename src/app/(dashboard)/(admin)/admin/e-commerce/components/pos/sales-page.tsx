import React from "react";
import { SaleProps } from "../../pos/sales/page";
import { Stack } from "@mui/material";
import EmptyState from "@/components/empty-state";
import SaleInfo from "./sales-info";

function SalesPage({ sales }: { sales: SaleProps[] }) {
  if (sales.length === 0) {
    return (
      <Stack>
        <EmptyState message="No sales Yet" />
      </Stack>
    );
  }

  return sales.map((sale) => {
    return <SaleInfo sale={sale} />;
  });
}

export default SalesPage;
