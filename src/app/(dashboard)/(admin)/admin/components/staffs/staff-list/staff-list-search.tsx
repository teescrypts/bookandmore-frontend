import React, { useCallback, useRef, useState } from "react";
import { useUpdateEffect } from "@/hooks/use-update-effect";
import { Filters } from "./staff-list";
import {
  Tabs,
  Tab,
  Divider,
  Stack,
  Box,
  OutlinedInput,
  InputAdornment,
  SvgIcon,
} from "@mui/material";
import Search from "@/icons/untitled-ui/duocolor/search";

const tabs = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

interface StaffListSearchProps {
  onFiltersChange: (filters: Filters) => void;
}

const StaffListSearch: React.FC<StaffListSearchProps> = ({
  onFiltersChange,
}) => {
  const queryRef = useRef<HTMLInputElement>(null);
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [filters, setFilters] = useState<Filters>({});

  const handleFiltersUpdate = useCallback(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  useUpdateEffect(() => {
    handleFiltersUpdate();
  }, [filters, handleFiltersUpdate]);

  const handleTabsChange = useCallback(
    (event: React.SyntheticEvent, value: string) => {
      setCurrentTab(value);
      setFilters((prevState) => {
        const updatedFilters = {
          ...prevState,
          active: undefined,
          inactive: undefined,
        };

        if (value !== "all") {
          (updatedFilters as any)[value] = true;
        }

        return updatedFilters;
      });
    },
    []
  );

  const handleQueryChange = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFilters((prevState) => ({
        ...prevState,
        query: queryRef.current?.value || "",
      }));
    },
    []
  );

  return (
    <>
      <Tabs
        indicatorColor="primary"
        onChange={handleTabsChange}
        scrollButtons="auto"
        sx={{ px: 3 }}
        textColor="primary"
        value={currentTab}
        variant="scrollable"
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        spacing={3}
        sx={{ p: 3 }}
      >
        <Box component="form" onSubmit={handleQueryChange} sx={{ flexGrow: 1 }}>
          <OutlinedInput
            defaultValue=""
            fullWidth
            inputRef={queryRef}
            placeholder="Search customers"
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon>
                  <Search />
                </SvgIcon>
              </InputAdornment>
            }
          />
        </Box>
      </Stack>
    </>
  );
};

export default StaffListSearch;
