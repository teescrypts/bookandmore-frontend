"use client";

import { useMounted } from "@/hooks/use-Mounted";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { staffApi } from "../utils/staff-apis";
import { useSelection } from "@/hooks/use-selection";
import { Stack, Card } from "@mui/material";
import StaffListSearch from "./staff-list-search";
import StaffListTable from "./staff-list-table";
import { StaffInfoType } from "../../../staffs/page";

export interface Filters {
  query?: string;
  active?: boolean;
  inactive?: boolean;
}

interface Sort {
  sortBy: string;
  sortDir: "asc" | "desc";
}

interface StaffSearchState {
  filters: Filters;
  page: number;
  rowsPerPage: number;
}

interface StaffsStoreState {
  staffs: StaffInfoType[];
  staffsCount: number;
}

// `useStaffSearch` Hook
export const useStaffSearch = () => {
  const [state, setState] = useState<StaffSearchState>({
    filters: {
      query: undefined,
      active: undefined,
      inactive: undefined,
    },
    page: 0,
    rowsPerPage: 5,
  });

  const handleFiltersChange = useCallback((filters: Filters) => {
    setState((prevState) => ({
      ...prevState,
      filters,
    }));
  }, []);

  const handlePageChange = useCallback((event: unknown, page: number) => {
    setState((prevState) => ({
      ...prevState,
      page,
    }));
  }, []);

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setState((prevState) => ({
        ...prevState,
        rowsPerPage: parseInt(event.target.value, 10),
      }));
    },
    []
  );

  return {
    handleFiltersChange,
    // handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    state,
  };
};

// `useCustomersStore` Hook
export const useStaffStore = (
  searchState: StaffSearchState,
  staffs: StaffInfoType[]
) => {
  const isMounted = useMounted();
  const [state, setState] = useState<StaffsStoreState>({
    staffs: [],
    staffsCount: 0,
  });

  const handleCustomersGet = useCallback(async () => {
    try {
      const response = await staffApi.getCustomers(searchState, staffs);

      if (isMounted()) {
        setState({
          staffs: response.data,
          staffsCount: response.count,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [searchState, isMounted]);

  useEffect(() => {
    // Update state when `data` changes
    setState({
      staffs,
      staffsCount: staffs.length,
    });
  }, [staffs]);

  useEffect(() => {
    handleCustomersGet();
  }, [handleCustomersGet]);

  return {
    ...state,
  };
};

// `useCustomersIds` Hook
export const useStaffId = (staffs: StaffInfoType[] = []) => {
  return useMemo(() => {
    return staffs.map((staff) => staff._id);
  }, [staffs]);
};

function StaffList({ staffs }: { staffs: StaffInfoType[] }) {
  const customersSearch = useStaffSearch();
  const customersStore = useStaffStore(customersSearch.state, staffs);
  const customersIds = useStaffId(customersStore.staffs);
  const customersSelection = useSelection(customersIds);

  return (
    <Stack spacing={4}>
      <Card>
        <StaffListSearch
          onFiltersChange={customersSearch.handleFiltersChange}
        />
        <StaffListTable
          count={customersStore.staffsCount}
          items={customersStore.staffs}
          onDeselectAll={customersSelection.handleDeselectAll}
          onDeselectOne={customersSelection.handleDeselectOne}
          onPageChange={customersSearch.handlePageChange}
          onRowsPerPageChange={customersSearch.handleRowsPerPageChange}
          onSelectAll={customersSelection.handleSelectAll}
          onSelectOne={customersSelection.handleSelectOne}
          page={customersSearch.state.page}
          rowsPerPage={customersSearch.state.rowsPerPage}
          selected={customersSelection.selected}
        />
      </Card>
    </Stack>
  );
}

export default StaffList;
