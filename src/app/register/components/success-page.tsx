"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

interface SuccessPageProps {
  email: string;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ email }) => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/demo/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          textAlign: "center",
          padding: 4,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Success!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Thank you for completing the process. Kindly login with your email and
          password
        </Typography>
        <Typography
          variant="h6"
          color="primary"
          sx={{ fontWeight: 600, marginBottom: 3 }}
        >
          {email}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleLoginClick}
          fullWidth
        >
          Login to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default SuccessPage;
