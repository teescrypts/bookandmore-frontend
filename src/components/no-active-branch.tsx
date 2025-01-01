"use client";

import EmptyState from "@/components/empty-state";
import { adminPaths } from "@/paths";
import { redirect, useRouter } from "next/navigation";
import React from "react";

function NoActiveBranch({ message }: { message: string }) {
  const router = useRouter();

  return (
    <EmptyState
      message={message}
      actionLabel="Go to Location"
      onActionClick={() => router.push(adminPaths.dashboard.location)}
    />
  );
}

export default NoActiveBranch;
