import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Slide,
  SlideProps,
} from "@mui/material";

interface PromoDialogProps {
  open: boolean;
  onClose: () => void;
  promoCode: string;
}

const Transition = React.forwardRef(function Transition(
  props: SlideProps,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PromoModal: React.FC<PromoDialogProps> = ({
  open,
  onClose,
  promoCode,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 4,
          padding: 3,
          backgroundImage: "linear-gradient(to bottom right, #f5f7fa, #c3cfe2)",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontSize: "1.8rem",
          fontWeight: "bold",
          color: "#1a73e8",
        }}
      >
        🎉 Special Promotion Just for You!
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          We're excited to offer you an exclusive discount! Use the promo code
          below to save big on your next purchase.
        </Typography>
        <Box
          sx={{
            textAlign: "center",
            backgroundColor: "#e0f7fa",
            padding: "15px",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: "#00796b",
            marginBottom: 3,
            boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          BLACKFRIDAY
        </Box>
        <Typography
          variant="body2"
          align="center"
          sx={{ mb: 2, color: "#616161" }}
        >
          Plus, earn <strong>loyalty points</strong> on every purchase! The more
          you spend, the more rewards you'll unlock.
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
        }}
      >
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          size="large"
          sx={{
            borderRadius: "20px",
            padding: "10px 20px",
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          GOT IT!!!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromoModal;
