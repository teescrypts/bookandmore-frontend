"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { useTheme } from "@mui/material/styles";

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const theme = useTheme();

  useEffect(() => {
    // Set nProgress color dynamically from theme
    nProgress.configure({
      showSpinner: false,
      template: `<div class="bar" role="bar" style="background-color: ${theme.palette.primary.main};"><div class="peg"></div></div>`,
    });

    const handleStart = () => {
      console.log("np should start");
      nProgress.start();
    };

    const handleComplete = () => {
      nProgress.done();
    };

    document.addEventListener("click", (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("a")) {
        handleStart();
      }
    });

    handleComplete();

    return () => {
      document.removeEventListener("click", () => handleStart);
      nProgress.done();
    };
  }, [pathname, searchParams, theme]);

  return null;
}
