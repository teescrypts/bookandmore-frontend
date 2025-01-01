"use client";

import ErrorUi from "@/components/_error";
import React from "react";

function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorUi reset={reset} />;
}

export default Error;
