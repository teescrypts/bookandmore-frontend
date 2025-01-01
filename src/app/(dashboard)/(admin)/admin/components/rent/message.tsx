"use client";

import notify from "@/utils/toast";
import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

function Message({
  state,
}: {
  state: { error?: string; success?: string } | null;
}) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.success) notify("Subscription updated");
    }
  }, [state]);

  return (
    <Typography textAlign={"center"} variant="subtitle2" color="error">
      {message}
    </Typography>
  );
}

export default Message;
