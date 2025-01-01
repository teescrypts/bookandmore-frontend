// components/EmptyState.tsx

import React from "react";
import { Box, Typography, Button, SvgIcon } from "@mui/material";
import SentimentDissatisfied from "@/icons/untitled-ui/duocolor/sentiment-dissatisfied";

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  actionLabel,
  onActionClick,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      p={4}
      textAlign="center"
      color="text.secondary"
    >
      <SvgIcon sx={{ fontSize: 70, mb: 4 }}>
        <SentimentDissatisfied />
      </SvgIcon>

      <Typography variant="h6" gutterBottom>
        {message}
      </Typography>
      {actionLabel && onActionClick && (
        <Button variant="contained" color="primary" onClick={onActionClick}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
