import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

interface NotificationBarProps {
  notifications: string[];
  displayDuration?: number; // Optional duration for each notification in milliseconds
}

const NotificationBar: React.FC<NotificationBarProps> = ({
  notifications,
  displayDuration = 3000, // Default to 3 seconds per notification
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (notifications.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % notifications.length);
      }, displayDuration);

      return () => clearInterval(timer); // Cleanup interval on component unmount
    }
  }, [notifications, displayDuration]);

  return (
    <AppBar position="static" color="info">
      <Toolbar>
        <Box sx={{ flexGrow: 1, textAlign: "center" }}>
          <Typography variant="h6">{notifications[currentIndex]}</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NotificationBar;
