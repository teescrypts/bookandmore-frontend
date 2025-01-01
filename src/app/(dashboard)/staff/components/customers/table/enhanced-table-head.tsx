import React, { ChangeEvent } from "react";
import TableHead from "@mui/material/TableHead";
import { Checkbox, TableCell, TableRow } from "@mui/material";

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    disablePadding: true,
    label: "Name",
  },
  {
    id: "bookings",
    disablePadding: false,
    label: "Bookings",
  },
  {
    id: "spent",
    disablePadding: false,
    label: "Spent",
  },
  // {
  //   id: "actions",
  //   disablePadding: false,
  //   label: "Actions",
  // },
];

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={
              headCell.id === "name"
                ? "left"
                : headCell.id === "actions"
                ? "right"
                : "center"
            }
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default EnhancedTableHead;
