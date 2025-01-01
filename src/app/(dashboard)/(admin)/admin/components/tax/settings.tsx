import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Grid2,
  CardActions,
  CardHeader,
} from "@mui/material";
import { Data } from "../../tax/page";
import Edit from "@/icons/untitled-ui/duocolor/edit";
import Add from "@/icons/untitled-ui/duocolor/add";
import { useRouter } from "next/navigation";
import { adminPaths } from "@/paths";
import ModalBox from "@/components/modal";
import TaxRegistrations from "./automatic/tax-registrations";

type SettingsType = { settings: Data };

const Settings: React.FC<SettingsType> = ({ settings }) => {
  const router = useRouter();
  const setup = settings.taxSettings;
  const registrations = setup.registrations;
  const taxSettings = setup.settings;
  const headOffice = taxSettings.head_office;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Settings" />
        <CardContent>
          <Stack spacing={2}>
            <Stack>
              <Typography variant="h6">Tax Behavior</Typography>
              <Typography variant="body1" color="text.secondary">
                {taxSettings.tax_behavior}
              </Typography>
            </Stack>
            <Divider />
            <Stack>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Head Office
              </Typography>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Address Line 1
                  </Typography>
                  <Typography> {headOffice.line1}</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Country
                  </Typography>
                  <Typography>{headOffice.country}</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    State
                  </Typography>
                  <Typography>{headOffice.state}</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    City
                  </Typography>
                  <Typography> {headOffice.city}</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Postal Code
                  </Typography>
                  <Typography> {headOffice.postal_code}</Typography>
                </Grid2>
              </Grid2>
            </Stack>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            onClick={() =>
              router.push(
                `${adminPaths.dashboard.tax.editSettings}?behavior=${taxSettings.tax_behavior}`
              )
            }
            startIcon={<Edit />}
          >
            Edit
          </Button>
        </CardActions>
      </Card>

      <Card>
        <CardHeader title="Registrations" />
        <CardContent>
          {registrations.map((reg) => {
            return (
              <>
                <Grid2 key={reg.id} container spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Country
                    </Typography>
                    <Typography> {reg.country}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      State
                    </Typography>
                    <Typography> {reg.state}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Type
                    </Typography>
                    <Typography> {reg.type}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 3 }}>
                    <Button variant="outlined" startIcon={<Edit />}>
                      Edit
                    </Button>
                  </Grid2>
                </Grid2>
                <Divider sx={{ my: 2 }} />
              </>
            );
          })}
        </CardContent>
        <Divider />
        <CardActions>
          <Button onClick={handleOpen} startIcon={<Add />}>
            Add Registration
          </Button>
        </CardActions>
      </Card>

      <ModalBox open={open} onClose={handleClose}>
        <TaxRegistrations />
      </ModalBox>
    </Box>
  );
};

export default Settings;
