import { useCallback, FC } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SvgIcon from "@mui/material/SvgIcon";
import { usePopover } from "@/hooks/use-popover";
import DownArrow from "@/icons/untitled-ui/duocolor/down-arrow";

// Define types for the props
interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  label: string;
  onChange?: (newValue: string[]) => void;
  options: Option[];
  value?: string[];
}

export const MultiSelect: FC<MultiSelectProps> = (props) => {
  const { label, onChange, options, value = [], ...other } = props;
  const popover = usePopover();

  const handleValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = [...value];

      if (event.target.checked) {
        newValue.push(event.target.value);
      } else {
        newValue = newValue.filter((item) => item !== event.target.value);
      }

      onChange?.(newValue);
    },
    [onChange, value]
  );

  return (
    <>
      <Button
        color="inherit"
        endIcon={
          <SvgIcon>
            <DownArrow />
          </SvgIcon>
        }
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        {...other}
      >
        {label}
      </Button>
      <Menu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        slotProps={{ paper: { style: { width: 250 } } }}
      >
        {options.map((option) => (
          <MenuItem key={option.label}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={value.includes(option.value)}
                  onChange={handleValueChange}
                  value={option.value}
                />
              }
              label={option.label}
              sx={{
                flexGrow: 1,
                mr: 0,
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
