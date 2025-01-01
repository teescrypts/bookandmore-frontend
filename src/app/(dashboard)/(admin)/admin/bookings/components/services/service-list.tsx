"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Divider,
  Grid2,
  IconButton,
  Tooltip,
} from "@mui/material";
import Edit from "@/icons/untitled-ui/duocolor/edit";
import Delete from "@/icons/untitled-ui/duocolor/delete";
import Pause from "@/icons/untitled-ui/duocolor/pause";
import Play from "@/icons/untitled-ui/duocolor/play";
import Circle from "@/components/circle";
import Link from "next/link";
import { adminPaths } from "@/paths";
import { ServiceType } from "./services";
import { deleteService, updateServiceStatus } from "@/app/actions/actions";
import notify from "@/utils/toast";
import EmptyState from "@/components/empty-state";
import { useRouter } from "next/navigation";

interface ServiceListProps {
  services: ServiceType[];
}

const ServiceList: React.FC<ServiceListProps> = ({ services }) => {
  const [message, setMessage] = useState("");
  const router = useRouter();

  return (
    <Box>
      {services.length > 0 ? (
        services.map((service, index) => (
          <>
            <Typography textAlign={"center"} variant="subtitle2" color="error">
              {message}
            </Typography>
            <Box
              key={index}
              sx={{
                my: 2,
                overflow: "hidden",
              }}
            >
              <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 12, md: 8 }}>
                  <Stack spacing={1} direction={"row"}>
                    <Circle color={service.color} />
                    <Typography variant="h5">{service.name}</Typography>
                  </Stack>

                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {service.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Status: <span>{`${service.status}`}</span>
                  </Typography>

                  <Grid2 container spacing={1} sx={{ my: 2 }}>
                    <Grid2 size={{ xs: 12, md: 12 }}>
                      <Chip
                        label={`Price: $${service.priceAmount}`}
                        sx={{ width: "100%" }}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 12 }}>
                      <Chip
                        label={`Estimated Time: ${service.estimatedTime?.hours}hr ${service.estimatedTime?.minutes}min`}
                        sx={{ width: "100%" }}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 12 }}>
                      <Chip
                        label={`Buffer Time: ${service.bufferTime?.hours}hr ${service.bufferTime?.minutes}min`}
                        sx={{ width: "100%" }}
                      />
                    </Grid2>
                  </Grid2>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-end"
                    sx={{ mt: 2 }}
                  >
                    {service.status === "active" ? (
                      <Tooltip title="Put service on hold">
                        <IconButton
                          color="error"
                          onClick={async () => {
                            const result = await updateServiceStatus(
                              service._id,
                              "paused"
                            );

                            if (result?.error) setMessage(result.error);
                            if (result?.success) notify(result.success);
                          }}
                        >
                          <Pause />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Resume service">
                        <IconButton
                          color="success"
                          onClick={async () => {
                            const result = await updateServiceStatus(
                              service._id,
                              "active"
                            );

                            if (result?.error) setMessage(result.error);
                            if (result?.success) notify(result.success);
                          }}
                        >
                          <Play />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={async () => {
                          const result = await deleteService(service._id);

                          if (result?.error) setMessage(result.error);
                          if (result?.success) notify(result.success);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>

                    <Link
                      href={`${adminPaths.dashboard.booking.services}/${service._id}`}
                    >
                      <Tooltip title="Edit">
                        <IconButton>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </Link>
                  </Stack>
                </Grid2>
              </Grid2>
            </Box>
            <Divider sx={{ my: 4 }} />
          </>
        ))
      ) : (
        <EmptyState
          message="You have not added any service"
          actionLabel="Add service"
          onActionClick={() =>
            router.push(`${adminPaths.dashboard.booking.services}/add`)
          }
        />
      )}
    </Box>
  );
};

export default ServiceList;
