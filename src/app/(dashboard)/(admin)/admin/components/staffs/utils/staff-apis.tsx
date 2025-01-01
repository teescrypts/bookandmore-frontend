import { applyPagination } from "@/utils/apply-pagination";
import { StaffInfoType } from "../../../staffs/page";
import { Filters } from "../staff-list/staff-list";

export interface StaffApiRequest {
  filters?: Filters;
  page?: number;
  rowsPerPage?: number;
}

export interface StaffApiResponse {
  data: StaffInfoType[];
  count: number;
}

export class StaffApi {
  async getCustomers(
    request: StaffApiRequest = {},
    staffs: StaffInfoType[]
  ): Promise<StaffApiResponse> {
    const { filters, page, rowsPerPage } = request;

    let data = staffs;
    let count = data.length;

    if (filters) {
      data = data.filter((staffInfo) => {
        if (filters.query) {
          const queryMatched = ["email", "fname", "lname"].some((property) =>
            (
              staffInfo.staff[
                property as keyof {
                  email: string;
                  fname: string;
                  lname: string;
                }
              ] as string
            )
              .toLowerCase()
              .includes(filters.query!.toLowerCase())
          );
          if (!queryMatched) return false;
        }

        if (typeof filters.active !== "undefined") {
          if (staffInfo.staff.active !== filters.active) {
            return false;
          }
        }

        if (typeof filters.inactive !== "undefined") {
          if (staffInfo.staff.active !== false) {
            return false;
          }
        }

        return true;
      });
      count = data.length;
    }

    if (page !== undefined && rowsPerPage !== undefined) {
      data = applyPagination(data, page, rowsPerPage);
    }

    return Promise.resolve({ data, count });
  }
}

export const staffApi = new StaffApi();
