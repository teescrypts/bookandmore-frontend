import { styled } from "@mui/material/styles";

interface OrderListContainerProps {
  open: boolean;
}

export const OrderListContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})<OrderListContainerProps>(({ theme, open }) => ({
  flexGrow: 1,
  overflow: "auto",
  zIndex: 1,
  [theme.breakpoints.up("lg")]: {
    marginRight: -500,
  },
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    [theme.breakpoints.up("lg")]: {
      marginRight: 0,
    },
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
