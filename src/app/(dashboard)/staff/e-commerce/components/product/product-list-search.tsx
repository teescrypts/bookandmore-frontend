import { useCallback, useMemo, useRef, useState, FormEvent } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import { MultiSelect } from "@/components/multi-select";
import Search from "@/icons/untitled-ui/duocolor/search";
import { useUpdateEffect } from "@/hooks/use-update-effect";
import { productTaxCodes } from "@/tax-codes/products";

// Define types for options and chips
interface Option {
  label: string;
  value: string;
}

interface ChipData {
  label: string;
  field: "name" | "category" | "status" | "inStock";
  value: string;
  displayValue?: string;
}

interface FiltersType {
  name: string | undefined;
  category: string[];
  status: string[];
  inStock: boolean | undefined;
}

interface ProductListSearchProps {
  onFiltersChange?: (filters: {
    name?: string;
    category?: string[];
    status?: string[];
    inStock?: boolean;
  }) => void;
}

const productCategory = productTaxCodes.map((product) => {
  return {
    label: product.name,
    value: product.name,
  };
});

const categoryOptions: Option[] = productCategory;


const stockOptions: Option[] = [
  { label: "All", value: "all" },
  { label: "Available", value: "available" },
  { label: "Out of Stock", value: "outOfStock" },
];

export const ProductListSearch: React.FC<ProductListSearchProps> = ({
  onFiltersChange,
}) => {
  const queryRef = useRef<HTMLInputElement>(null);
  const [chips, setChips] = useState<ChipData[]>([]);

  const handleChipsUpdate = useCallback(() => {
    const filters: FiltersType = {
      name: undefined,
      category: [] as string[],
      status: [] as string[],
      inStock: undefined as boolean | undefined,
    };

    chips.forEach((chip) => {
      switch (chip.field) {
        case "name":
          filters.name = chip.value;
          break;
        case "category":
          filters.category.push(chip.value);
          break;
        case "status":
          filters.status.push(chip.value);
          break;
        case "inStock":
          filters.inStock = chip.value === "available";
          break;
      }
    });

    onFiltersChange?.(filters);
  }, [chips, onFiltersChange]);

  useUpdateEffect(() => {
    handleChipsUpdate();
  }, [chips, handleChipsUpdate]);

  const handleChipDelete = useCallback((deletedChip: ChipData) => {
    setChips((prevChips) =>
      prevChips.filter(
        (chip) =>
          !(
            deletedChip.field === chip.field && deletedChip.value === chip.value
          )
      )
    );
  }, []);

  const handleQueryChange = useCallback((event: FormEvent) => {
    event.preventDefault();
    const value = queryRef.current?.value || "";

    setChips((prevChips) => {
      const found = prevChips.find((chip) => chip.field === "name");

      if (found && value) {
        return prevChips.map((chip) =>
          chip.field === "name" ? { ...chip, value } : chip
        );
      }

      if (found && !value) {
        return prevChips.filter((chip) => chip.field !== "name");
      }

      if (!found && value) {
        const chip: ChipData = {
          label: "Name",
          field: "name",
          value,
        };
        return [...prevChips, chip];
      }

      return prevChips;
    });

    if (queryRef.current) {
      queryRef.current.value = "";
    }
  }, []);

  const handleCategoryChange = useCallback((values: string[]) => {
    setChips((prevChips) => {
      const valuesFound: string[] = [];

      const newChips = prevChips.filter((chip) => {
        if (chip.field !== "category") {
          return true;
        }
        const found = values.includes(chip.value);
        if (found) {
          valuesFound.push(chip.value);
        }
        return found;
      });

      if (values.length === valuesFound.length) {
        return newChips;
      }

      values.forEach((value) => {
        if (!valuesFound.includes(value)) {
          const option = categoryOptions.find(
            (option) => option.value === value
          );
          if (option) {
            newChips.push({
              label: "Category",
              field: "category",
              value,
              displayValue: option.label,
            });
          }
        }
      });

      return newChips;
    });
  }, []);

  // const handleStatusChange = useCallback((values: string[]) => {
  //   setChips((prevChips) => {
  //     const valuesFound: string[] = [];

  //     const newChips = prevChips.filter((chip) => {
  //       if (chip.field !== "status") {
  //         return true;
  //       }
  //       const found = values.includes(chip.value);
  //       if (found) {
  //         valuesFound.push(chip.value);
  //       }
  //       return found;
  //     });

  //     if (values.length === valuesFound.length) {
  //       return newChips;
  //     }

  //     // values.forEach((value) => {
  //     //   if (!valuesFound.includes(value)) {
  //     //     const option = statusOptions.find((option) => option.value === value);
  //     //     if (option) {
  //     //       newChips.push({
  //     //         label: "Status",
  //     //         field: "status",
  //     //         value,
  //     //         displayValue: option.label,
  //     //       });
  //     //     }
  //     //   }
  //     // });

  //     return newChips;
  //   });
  // }, []);

  const handleStockChange = useCallback((values: string[]) => {
    setChips((prevChips) => {
      const newChips = prevChips.filter((chip) => chip.field !== "inStock");
      const latestValue = values[values.length - 1];

      if (latestValue === "available") {
        newChips.push({
          label: "Stock",
          field: "inStock",
          value: "available",
          displayValue: "Available",
        });
      } else if (latestValue === "outOfStock") {
        newChips.push({
          label: "Stock",
          field: "inStock",
          value: "outOfStock",
          displayValue: "Out of Stock",
        });
      }
      return newChips;
    });
  }, []);

  const categoryValues = useMemo(
    () =>
      chips
        .filter((chip) => chip.field === "category")
        .map((chip) => chip.value),
    [chips]
  );

  // const statusValues = useMemo(
  //   () =>
  //     chips.filter((chip) => chip.field === "status").map((chip) => chip.value),
  //   [chips]
  // );

  const stockValues = useMemo(() => {
    const values = chips
      .filter((chip) => chip.field === "inStock")
      .map((chip) => chip.value);
    if (values.length === 0) {
      values.unshift("all");
    }
    return values;
  }, [chips]);

  const showChips = chips.length > 0;

  return (
    <div>
      <Stack
        alignItems="center"
        component="form"
        direction="row"
        onSubmit={handleQueryChange}
        spacing={2}
        sx={{ p: 2 }}
      >
        <SvgIcon>
          <Search />
        </SvgIcon>
        <Input
          defaultValue=""
          disableUnderline
          fullWidth
          inputProps={{ ref: queryRef }}
          placeholder="Search by product name"
          sx={{ flexGrow: 1 }}
        />
      </Stack>
      <Divider />
      {showChips ? (
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          gap={1}
          sx={{ p: 2 }}
        >
          {chips.map((chip, index) => (
            <Chip
              key={index}
              label={
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    "& span": { fontWeight: 600 },
                  }}
                >
                  <span>{chip.label}</span>: {chip.displayValue || chip.value}
                </Box>
              }
              onDelete={() => handleChipDelete(chip)}
              variant="outlined"
            />
          ))}
        </Stack>
      ) : (
        <Box sx={{ p: 2.5 }}>
          <Typography color="text.secondary" variant="subtitle2">
            No filters applied
          </Typography>
        </Box>
      )}
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        spacing={1}
        sx={{ p: 1 }}
      >
        <MultiSelect
          label="Category"
          onChange={handleCategoryChange}
          options={categoryOptions}
          value={categoryValues}
        />
        {/* <MultiSelect
          label="Status"
          onChange={handleStatusChange}
          options={statusOptions}
          value={statusValues}
        /> */}
        <MultiSelect
          label="Stock"
          onChange={handleStockChange}
          options={stockOptions}
          value={stockValues}
        />
      </Stack>
    </div>
  );
};
