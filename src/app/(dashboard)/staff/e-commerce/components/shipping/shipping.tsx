"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Delete from "@/icons/untitled-ui/duocolor/delete";
import ModalBox from "@/components/modal";
import EmptyState from "@/components/empty-state";
import AddShipping from "./add-shipping";
import { AllowedCountryType, ShippingOptionType } from "../../shipping/page";
import Edit from "@/icons/untitled-ui/duocolor/edit";
import EditShipping from "./edit-shipping";
import { deleteShippingOption } from "@/app/actions/actions";
import notify from "@/utils/toast";
import AllowedCountry from "./allowed-county";

type PropTypes = {
  shippingRates: ShippingOptionType[];
  allowedCountries: AllowedCountryType[];
};

const ShippingSettings: React.FC<PropTypes> = ({
  shippingRates,
  allowedCountries,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const [currentShipping, setCurrentShipping] = useState<
    ShippingOptionType | undefined
  >();

  const [message, setMessaage] = useState("");

  return (
    <>
      <Stack spacing={2}>
        <Card>
          <CardContent>
            <Typography variant="h6">Shipping Options</Typography>
            <Divider sx={{ my: 2 }} />

            {shippingRates.length > 0 ? (
              <Box sx={{ mt: 4 }}>
                <Typography
                  color="error"
                  textAlign={"center"}
                  variant="subtitle2"
                >
                  {message}
                </Typography>
                {shippingRates.map((rate) => (
                  <Stack
                    key={rate._id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      background: "rgba(0,0,0,0.05)",
                      p: 2,
                      mb: 2,
                      borderRadius: 1,
                    }}
                  >
                    <Typography>
                      {rate.displayName} - ${rate.amount} ({rate.minEstimate} -{" "}
                      {rate.maxEstimate} {rate.unit})
                    </Typography>
                    <Stack direction={"row"} spacing={2}>
                      <Button
                        onClick={() => {
                          const currentShipping = shippingRates.find(
                            (shippingRate) => shippingRate._id === rate._id
                          );

                          setCurrentShipping(currentShipping);
                          handleOpenEdit();
                        }}
                        variant="text"
                        color="info"
                        startIcon={<Edit />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="text"
                        color="error"
                        startIcon={<Delete />}
                        onClick={async () => {
                          const result = await deleteShippingOption(rate._id);

                          if (result?.error) setMessaage(result.error);
                          if (result?.success) notify(result.success);
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                ))}
              </Box>
            ) : (
              <EmptyState
                message="No shipping option added"
                actionLabel="Add shipping Option"
                onActionClick={handleOpen}
              />
            )}
            <Divider sx={{ my: 2 }} />

            {shippingRates.length > 0 && (
              <Stack direction={"row"} justifyContent={"flex-start"}>
                <Button variant="contained" onClick={handleOpen}>
                  Add Shipping Option
                </Button>
              </Stack>
            )}

            <AllowedCountry allowedCountries={allowedCountries} />
          </CardContent>
        </Card>
      </Stack>

      <ModalBox title="Add shipping Option" open={open} onClose={handleClose}>
        <AddShipping closeModal={handleClose} />
      </ModalBox>

      <ModalBox
        title="Edit shipping Option"
        open={openEdit}
        onClose={handleCloseEdit}
      >
        {currentShipping && <EditShipping shippingOption={currentShipping} />}
      </ModalBox>
    </>
  );
};

export default ShippingSettings;
