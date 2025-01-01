"use client";

import {
  Box,
  Container,
  Stack,
  Typography,
  Tabs,
  Tab,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import React, { SyntheticEvent, useCallback, useEffect, useState } from "react";
import GeneralSettings from "./geneare-settings";
import SecuritySettings from "./security-settings";
import ModalBox from "@/components/modal";
import CheckDone01 from "@/icons/untitled-ui/duocolor/check-done-01";
import Close from "@/icons/untitled-ui/duocolor/close";
import { bookAppointment } from "@/app/actions/actions";
import { useRouter } from "next/navigation";
import notify from "@/utils/toast";
import { ClientData } from "../../profile/page";

const tabs = [
  { label: "General", value: "general" },
  { label: "Security", value: "security" },
];

function AccountManager({user}: {user: ClientData}) {
  const [currentTab, setCurrentTab] = useState("general");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardRequired, setCardRequired] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const router = useRouter();

  const handleTabsChange = useCallback(
    (event: SyntheticEvent<Element, Event>, value: string) => {
      setCurrentTab(value);
    },
    []
  );

  useEffect(() => {
    const pendingApt = localStorage.getItem("pendingBooking");

    if (pendingApt) {
      handleOpen();
    }
  }, []);

  const handleCompleteBooking = async () => {
    setLoading(true);
    const data = localStorage.getItem("bookingData");
    if (data) {
      const result = await bookAppointment(JSON.parse(data));

      if (result?.error) {
        setMessage(result.error);
        setLoading(false);

        return;
      }

      if (result?.success) {
        if (result.success === "Appointment booked successfully")
          router.push("/demo/barber/dashboard/appointments");

        if (result.success === "Customer payment method required.") {
          setCardRequired(true);
        }
      }

      setLoading(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("bookingData");
    localStorage.removeItem("pendingBooking");
    handleClose();
    notify("Pending appointment deleted");
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          mt: { md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3} sx={{ mb: 3 }}>
            <Typography variant="h4">Profile</Typography>
            <div>
              <Tabs
                indicatorColor="primary"
                onChange={handleTabsChange}
                scrollButtons="auto"
                textColor="primary"
                value={currentTab}
                variant="scrollable"
              >
                {tabs.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </Tabs>
              <Divider />
            </div>
          </Stack>
          {currentTab === "general" && <GeneralSettings user={user} />}
          {currentTab === "security" && <SecuritySettings />}
        </Container>
      </Box>

      <ModalBox open={open} onClose={handleClose}>
        {!cardRequired ? (
          <Stack
            spacing={3}
            sx={{
              p: 3,
              // bgcolor: "background.paper",
              // borderRadius: 2,
              // boxShadow: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" fontWeight={500}>
              Pending Appointment
            </Typography>
            <Typography color="error" textAlign={"center"} variant="subtitle2">
              {message}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hi, you have a pending appointment to complete. Please take action
              below.
            </Typography>

            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button
                variant="contained"
                startIcon={<CheckDone01 />}
                sx={{ textTransform: "none" }}
                onClick={handleCompleteBooking}
                disabled={loading}
              >
                {loading ? <CircularProgress /> : "Complete"}
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Close />}
                sx={{ textTransform: "none" }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Stack
            spacing={3}
            sx={{
              p: 3,
              // bgcolor: "background.paper",
              // borderRadius: 2,
              // boxShadow: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" fontWeight={500}>
              Card Required
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You will incur a charge only if you fail to attend your
              appointment or cancel outside the designated cancellation window
              outlined in the booking policy.
            </Typography>

            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button
                variant="contained"
                startIcon={<CheckDone01 />}
                sx={{ textTransform: "none" }}
                onClick={() => router.push("/register/stripe-setup")}
              >
                Continue
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Close />}
                sx={{ textTransform: "none" }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        )}
      </ModalBox>
    </>
  );
}

export default AccountManager;
