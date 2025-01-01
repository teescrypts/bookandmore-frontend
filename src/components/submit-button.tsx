"use client";

import { Button, CircularProgress } from "@mui/material";
import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  title,
  isFullWidth,
  icon,
}: {
  title: string;
  isFullWidth: boolean;
  icon?: ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      fullWidth={isFullWidth}
      variant="contained"
      startIcon={icon}
    >
      {pending ? <CircularProgress /> : title}
    </Button>
  );
}
