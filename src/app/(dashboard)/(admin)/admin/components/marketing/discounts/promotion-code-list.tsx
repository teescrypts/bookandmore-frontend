"use client";

import React, { useState } from "react";
import { PromotionCodeType } from "../../../marketing/discounts/page";
import Remove from "@/icons/untitled-ui/duocolor/remove";
import {
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import { format } from "date-fns";
import { updatePromotionCode } from "@/app/actions/actions";
import notify from "@/utils/toast";

function formatCreatedAt(createdAt: Date): string {
  return format(new Date(createdAt), "MMMM d, yyyy");
}

function PromotionCodeList({ promo }: { promo: PromotionCodeType }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Box sx={{ mt: 1 }}>
      <Typography color="error" variant="subtitle2">
        {message}
      </Typography>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2">
          Added on: {formatCreatedAt(new Date(promo.createdAt))}
          <br />
          Code: {promo.code} <br />
          Maximum Redemptions:{" "}
          {promo?.maxRedemptions ? promo.maxRedemptions : "infinity"} <br />
          Minimum Amount: $
          {promo.restrictions?.minimumAmount
            ? promo.restrictions?.minimumAmount
            : 0}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            color={promo.active ? "error" : "secondary"}
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const result = await updatePromotionCode(
                promo._id,
                !promo.active
              );

              if (result?.error) setMessage(result.error);
              if (result?.success) notify(result.success);
              setLoading(false);
            }}
          >
            {promo.active ? "Inactivate" : "Activate"}
          </Button>
        </Stack>
      </Stack>
      <Typography variant="body2">
        First Order Only:{" "}
        {promo.restrictions.firstTransactionOnly ? "Yes" : "No"}
      </Typography>

      <Divider sx={{ my: 2 }} />
    </Box>
  );
}

export default PromotionCodeList;
