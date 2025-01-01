import Search from "@/icons/untitled-ui/duocolor/search";
import {
  Tabs,
  Tab,
  Divider,
  Stack,
  Box,
  OutlinedInput,
  InputAdornment,
  SvgIcon,
  TextField,
} from "@mui/material";
import React from "react";

function SearchFilter() {
  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        spacing={3}
        sx={{ p: 3 }}
      >
        <Box component="form" sx={{ flexGrow: 1 }}>
          <OutlinedInput
            defaultValue=""
            fullWidth
            // inputProps={{ ref: queryRef }}
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
}

export default SearchFilter;
