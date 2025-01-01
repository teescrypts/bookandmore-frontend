"use client";

import { Card, Radio, Stack, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import CommissionForm from "./commission-form";
import RegularForm from "./regular-form";
import { ServiceForFormType } from "../../staffs/add/page";

const categoryOptions = [
  {
    description:
      "Staff eligible for service-based commissions on appointments booked directly with them.",
    title: "Commision",
    value: "commission",
  },
  {
    description:
      "Regular staff on non-commission pay, with dashboard access and customizable permissions.",
    title: "Regular",
    value: "regular",
  },
];

function AddStaffForm({ services }: { services: ServiceForFormType[] }) {
  const [category, setCategory] = useState(categoryOptions[1].value);

  const handleCategoryChange = useCallback((category: string) => {
    setCategory(category);
  }, []);

  return (
    <Stack spacing={4}>
      <Stack spacing={3}>
        <div>
          <Typography variant="h6">Category</Typography>
        </div>
        <Stack spacing={2}>
          {categoryOptions.map((option) => (
            <Card
              key={option.value}
              sx={{
                alignItems: "center",
                cursor: "pointer",
                display: "flex",
                p: 2,
                ...(category === option.value && {
                  backgroundColor: "primary.alpha12",
                  boxShadow: (theme) =>
                    `${theme.palette.primary.main} 0 0 0 1px`,
                }),
              }}
              onClick={() => handleCategoryChange(option.value)}
              variant="outlined"
            >
              <Stack direction="row" spacing={2}>
                <Radio checked={category === option.value} color="primary" />
                <div>
                  <Typography variant="subtitle1">{option.title}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {option.description}
                  </Typography>
                </div>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>

      {category === "commission" && <CommissionForm services={services} />}
      {category === "regular" && <RegularForm services={services} />}
    </Stack>
  );
}

export default AddStaffForm;
