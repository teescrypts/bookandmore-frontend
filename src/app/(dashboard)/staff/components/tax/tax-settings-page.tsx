"use client";

import React, { useState } from "react";
import { Data } from "../../tax/page";
import EmptyState from "@/components/empty-state";
import { useRouter } from "next/navigation";
import ModalBox from "@/components/modal";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import Link from "next/link";
import Settings from "./settings";
import { staffPaths } from "@/paths";

function TaxSettingsPage({ settings }: { settings: Data | string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (typeof settings === "string") {
    return (
      <>
        <EmptyState
          message="You do not have active Tax Settings"
          actionLabel="Set up Now"
          onActionClick={handleOpen}
        />
        <ModalBox open={open} onClose={handleClose}>
          <Box>
            <Stack spacing={3}>
              <Card
                variant="outlined"
                onClick={() =>
                  router.push(staffPaths.dashboard.tax.settings.automatic)
                }
                sx={{ cursor: "pointer", "&:hover": { boxShadow: 3 } }}
              >
                <CardContent>
                  <Typography variant="h6">
                    Set Up Automatic Tax Settings With Stripe
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1, mb: 2 }}
                  >
                    Stripe Tax helps businesses manage tax compliance
                    automatically by calculating and collecting the correct tax
                    rate.
                  </Typography>
                  <Button
                    size="small"
                    color="primary"
                    component={Link}
                    href="https://support.stripe.com/questions/understanding-stripe-tax-pricing"
                    target="_blank"
                    rel="noopener"
                  >
                    Learn about Stripe Tax Pricing
                  </Button>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </ModalBox>
      </>
    );
  }

  return <Settings settings={settings} />;
}

export default TaxSettingsPage;
