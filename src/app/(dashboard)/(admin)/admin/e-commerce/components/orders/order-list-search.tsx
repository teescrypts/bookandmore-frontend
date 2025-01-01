import { SyntheticEvent, useCallback, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import { useUpdateEffect } from "@/hooks/use-update-effect";
import Search from "@/icons/untitled-ui/duocolor/search";
import { OrderType } from "../../orders/page";

type Filters = { query: string | undefined; status: string | undefined };

const tabOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Processing",
    value: "processing",
  },
  {
    label: "Shipped",
    value: "shipped",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Delivered",
    value: "delivered",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];

const sortOptions = [
  {
    label: "Newest",
    value: "desc",
  },
  {
    label: "Oldest",
    value: "asc",
  },
];

export const OrderListSearch = (props: {
  onFiltersChange: (filters: Filters) => void;
  onSortChange: (sortDir: "asc" | "desc") => void;
  sortBy: keyof OrderType;
  sortDir: "asc" | "desc";
}) => {
  const {
    onFiltersChange,
    onSortChange,
    sortBy = "createdAt",
    sortDir = "asc",
  } = props;
  const queryRef = useRef<HTMLInputElement | null>(null);
  const [currentTab, setCurrentTab] = useState("all");
  const [filters, setFilters] = useState<{
    query: string | undefined;
    status: string | undefined;
  }>({
    query: undefined,
    status: undefined,
  });

  const handleFiltersUpdate = useCallback(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  useUpdateEffect(() => {
    handleFiltersUpdate();
  }, [filters, handleFiltersUpdate]);

  const handleTabsChange = useCallback(
    (event: SyntheticEvent<Element, Event>, tab: string) => {
      setCurrentTab(tab);
      const status = tab === "all" ? undefined : tab;

      setFilters((prevState) => ({
        ...prevState,
        status,
      }));
    },
    []
  );

  const handleQueryChange = useCallback(
    (event: SyntheticEvent<Element, Event>) => {
      event.preventDefault();
      const query = queryRef.current?.value || "";
      setFilters((prevState) => ({
        ...prevState,
        query,
      }));
    },
    []
  );

  const handleSortChange = useCallback(
    (event: SyntheticEvent<Element, Event>) => {
      const target = event.target as HTMLSelectElement;
      const sortDir = target.value;
      onSortChange?.(sortDir as "asc" | "desc");
    },
    [onSortChange]
  );

  return (
    <div>
      <Tabs
        indicatorColor="primary"
        onChange={handleTabsChange}
        scrollButtons="auto"
        sx={{ px: 3 }}
        textColor="primary"
        value={currentTab}
        variant="scrollable"
      >
        {tabOptions.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        gap={3}
        sx={{ p: 3 }}
      >
        <Box component="form" onSubmit={handleQueryChange} sx={{ flexGrow: 1 }}>
          <OutlinedInput
            defaultValue=""
            fullWidth
            inputProps={{ ref: queryRef }}
            name="orderNumber"
            placeholder="Search by order number"
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon>
                  <Search />
                </SvgIcon>
              </InputAdornment>
            }
          />
        </Box>
        <TextField
          label="Sort By"
          name="sort"
          variant="outlined"
          onChange={handleSortChange}
          select
          slotProps={{ select: { native: true } }}
          value={sortDir}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </Stack>
    </div>
  );
};
