import { RouterLink } from "@/components/router-link";
import { Scrollbar } from "@/components/scrollbar";
import { getInitials } from "@/utils/get-initials";
import {
  Box,
  Stack,
  Checkbox,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Typography,
  TablePagination,
  Link,
  CircularProgress,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { adminPaths, API_BASE_URL } from "@/paths";
import { StaffInfoType } from "../../../staffs/page";
import { deleteStaffs } from "@/app/actions/actions";
import notify from "@/utils/toast";

interface PropType {
  count: number;
  items: StaffInfoType[];
  onDeselectAll: () => void;
  onDeselectOne: (id: string) => void;
  onPageChange: (e: unknown, page: number) => void;
  onRowsPerPageChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSelectAll: () => void;
  onSelectOne: (id: string) => void;
  page: number;
  rowsPerPage: number;
  selected: string[];
}

function StaffListTable({
  count = 0,
  items = [],
  onDeselectAll,
  onDeselectOne,
  onPageChange = () => {},
  onRowsPerPageChange,
  onSelectAll,
  onSelectOne,
  page = 0,
  rowsPerPage = 0,
  selected = [],
}: PropType) {
  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;
  const enableBulkActions = selected.length > 0;
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    for (let i = 0; i < selected.length; i++) {
      const result = await deleteStaffs(selected[i]);
      if (result?.error) {
        setMessage(result.error);
        setLoading(false);
        return;
      }
    }

    notify("Staffs Deleted");
    setLoading(false);
  };

  return (
    <>
      <Typography color="error" variant="subtitle2">
        {message}
      </Typography>
      <Box sx={{ position: "relative" }}>
        {enableBulkActions && (
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "neutral.800" : "neutral.50",
              display: enableBulkActions ? "flex" : "none",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              px: 2,
              py: 0.5,
              zIndex: 10,
            }}
          >
            <Checkbox
              checked={selectedAll}
              indeterminate={selectedSome}
              onChange={(event) => {
                if (event.target.checked) {
                  onSelectAll?.();
                } else {
                  onDeselectAll?.();
                }
              }}
            />
            <Button
              disabled={loading}
              onClick={handleDelete}
              color="error"
              size="small"
            >
              Delete
            </Button>
            {loading && <CircularProgress />}
          </Stack>
        )}
        <Scrollbar>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Commission</TableCell>
                <TableCell>Booking</TableCell>
                {/* <TableCell align="right">Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((staffInfo) => {
                const isSelected = selected.includes(staffInfo._id);

                return (
                  <TableRow hover key={staffInfo._id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(staffInfo._id);
                          } else {
                            onDeselectOne?.(staffInfo._id);
                          }
                        }}
                        value={isSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <Avatar
                          src={`${API_BASE_URL}/users/${staffInfo.staff._id}/avatar`}
                          sx={{
                            height: 42,
                            width: 42,
                          }}
                        >
                          {getInitials(
                            `${staffInfo.staff.fname} ${staffInfo.staff.lname}`
                          )}
                        </Avatar>
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            href={adminPaths.dashboard.staff.add}
                            variant="subtitle2"
                          >
                            {`${staffInfo.staff.fname} ${staffInfo.staff.lname}`}
                          </Link>
                          <Typography color="text.secondary" variant="body2">
                            {staffInfo.staff.email}
                          </Typography>
                        </div>
                      </Stack>
                    </TableCell>
                    <TableCell>{staffInfo.type}</TableCell>
                    <TableCell>
                      {staffInfo?.commission
                        ? `${staffInfo.commission}%`
                        : "NIL"}
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {staffInfo.staff?.active ? "Active" : "Inactive"}
                      </Typography>
                    </TableCell>

                    {/* <TableCell align="right">
                    <Tooltip title="Change Type">
                      <IconButton>
                        <SvgIcon fontSize="medium">
                          <CircleChange />
                        </SvgIcon>
                      </IconButton>
                    </Tooltip>
                  </TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Scrollbar>
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
    </>
  );
}

export default StaffListTable;
