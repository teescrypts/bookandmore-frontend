"use client";

import React, { useCallback, useEffect, useState } from "react";
import { productsApi } from "./utils/products-api";
import { RouterLink } from "@/components/router-link";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  SvgIcon,
  Card,
} from "@mui/material";
import { ProductListSearch } from "./product-list-search";
import { ProductListTable } from "./product-list-table";
import Add from "@/icons/untitled-ui/duocolor/add";
import { useMounted } from "@/hooks/use-Mounted";
import { Product } from "../../products/page";
import EmptyState from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { staffPaths } from "@/paths";

interface FiltersType {
  name?: string;
  category?: string[];
  inStock?: boolean;
}

type ProductSearchType = {
  filters: FiltersType;
  page: number;
  rowsPerPage: number;
};

const useProductsSearch = () => {
  const [state, setState] = useState<ProductSearchType>({
    filters: {
      name: undefined,
      category: [],
      inStock: undefined,
    },
    page: 0,
    rowsPerPage: 5,
  });

  const handleFiltersChange = useCallback((filters: FiltersType) => {
    setState((prevState) => ({
      ...prevState,
      filters,
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
    handlePageChange,
    handleRowsPerPageChange,
    state,
  };
};

const useProductsStore = (searchState: ProductSearchType, data: Product[]) => {
  const isMounted = useMounted();
  const [state, setState] = useState<{
    products: Product[];
    productsCount: number;
  }>({
    products: data,
    productsCount: data.length,
  });

  const handleProductsGet = useCallback(async () => {
    try {
      const response = await productsApi.getProducts(searchState, data);

      if (isMounted()) {
        setState({
          products: response.data,
          productsCount: response.count,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [searchState, isMounted, data]);

  useEffect(() => {
    // Update state when `data` changes
    setState({
      products: data,
      productsCount: data.length,
    });
  }, [data]);

  useEffect(() => {
    handleProductsGet();
  }, [searchState]);

  return {
    ...state,
  };
};

function ProductList({ products }: { products: Product[] }) {
  const productsSearch = useProductsSearch();
  const productsStore = useProductsStore(productsSearch.state, products);
  const router = useRouter();

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Products</Typography>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <Button
                  component={RouterLink}
                  href={staffPaths.dashboard.ecommerce.add}
                  startIcon={
                    <SvgIcon>
                      <Add />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add Product
                </Button>
              </Stack>
            </Stack>
            {products.length === 0 ? (
              <EmptyState
                message="You have not added any product"
                actionLabel="Add product"
                onActionClick={() =>
                  router.push(staffPaths.dashboard.ecommerce.add)
                }
              />
            ) : (
              <Card>
                <ProductListSearch
                  onFiltersChange={productsSearch.handleFiltersChange}
                />
                <ProductListTable
                  onPageChange={productsSearch.handlePageChange}
                  onRowsPerPageChange={productsSearch.handleRowsPerPageChange}
                  page={productsSearch.state.page}
                  items={productsStore.products}
                  count={productsStore.productsCount}
                  rowsPerPage={productsSearch.state.rowsPerPage}
                />
              </Card>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default ProductList;
