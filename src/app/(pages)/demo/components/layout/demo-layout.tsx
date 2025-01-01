"use client";

import React, { ReactNode } from "react";
import DemoVerticalLayout from "./demo-vertical-layout";
import { useSections } from "@/app/(dashboard)/hooks/client-config";

function DemoLayout({ children }: { children: ReactNode }) {
  const sections = useSections();

  return (
    <DemoVerticalLayout sections={sections} navColor="blend-in">
      {children}
    </DemoVerticalLayout>
  );
}

export default DemoLayout;
