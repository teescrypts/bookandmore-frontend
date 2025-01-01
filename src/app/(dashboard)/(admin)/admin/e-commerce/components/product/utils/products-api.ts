import { applyPagination } from "@/utils/apply-pagination";
import { Product } from "../../../products/page";

type Filters = {
  name?: string;
  category?: string[];
  status?: string[];
  inStock?: boolean;
};

type GetProductsRequest = {
  filters?: Filters;
  page?: number;
  rowsPerPage?: number;
};

type GetProductsResponse = {
  data: Product[];
  count: number;
};

class ProductsApi {
  getProducts(
    request: GetProductsRequest = {},
    data: Product[]
  ): Promise<GetProductsResponse> {
    const { filters, page, rowsPerPage } = request;

    // let data = products;
    let count: number = data.length;

    if (filters) {
      data = data.filter((product) => {
        if (filters.name && filters.name !== "") {
          const nameMatched = product.name
            .toLowerCase()
            .includes(filters.name.toLowerCase());
          if (!nameMatched) return false;
        }

        if (filters.category && filters.category.length > 0) {
          const categoryMatched = filters.category.includes(product.category.name);
          if (!categoryMatched) return false;
        }

        // if (filters.status && filters.status.length > 0) {
        //   const statusMatched = filters.status.includes(product.inStock);
        //   if (!statusMatched) return false;
        // }

        if (typeof filters.inStock !== "undefined") {
          const stockMatched = product.inStock === filters.inStock;
          if (!stockMatched) return false;
        }

        return true;
      });
      count = data.length;
    }

    if (typeof page !== "undefined" && typeof rowsPerPage !== "undefined") {
      data = applyPagination(data, page, rowsPerPage);
    }

    return Promise.resolve({
      data,
      count,
    });
  }
}

export const productsApi = new ProductsApi();
