"use client";

import React from "react";
import {
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Button,
  Box,
  StepIconProps,
  useTheme,
  Stack,
} from "@mui/material";
import AutoAwesome from "@/icons/untitled-ui/duocolor/auto-awesome";
import ContactMail from "@/icons/untitled-ui/duocolor/contact-mail";
import CreditCard from "@/icons/untitled-ui/duocolor/credit-card";
import Build from "@/icons/untitled-ui/duocolor/build";
import HourGlass from "@/icons/untitled-ui/duocolor/hour-glass";
import Support from "@/icons/untitled-ui/duocolor/support";
import Link from "next/link";

const steps = [
  {
    label: "Test the Demo",
    description:
      "Explore the available demo to understand how the system works and what it can offer your business.",
    icon: <AutoAwesome />,
  },
  {
    label: "Contact Us",
    description:
      "Reach out to us to express your interest in setting up the website for your business needs.",
    icon: <ContactMail />,
  },
  {
    label: "Pay Installation Fee",
    description:
      "Pay the installation fee (check the pricing page for details).",
    icon: <CreditCard />,
  },
  {
    label: "Optional Customization",
    description:
      "Provide any customization requirements that you would like implemented.",
    icon: <Build />,
  },
  {
    label: "Build Time",
    description: "We will build your customized website within 10 working days.",
    icon: <HourGlass />,
  },
  {
    label: "Free Technical Support",
    description:
      "Enjoy 6 months of free technical support after your website is completed.",
    icon: <Support />,
  },
];

const CustomStepIcon = (
  props: StepIconProps & { stepIcon: React.ReactNode }
) => {
  const { stepIcon, active } = props;
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: 50,
        height: 50,
        borderRadius: "50%",
        backgroundColor: active
          ? theme.palette.primary.main
          : theme.palette.grey[300],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: active ? theme.palette.common.white : theme.palette.text.primary,
        transition: "background-color 0.3s",
      }}
    >
      {stepIcon}
    </Box>
  );
};

function HowItWorks() {
  return (
    <Stack alignItems={"center"}>
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems={"center"} sx={{ my: 6 }}>
          <Typography variant="h4">How It Works</Typography>
          <Stepper orientation="vertical">
            {steps.map((step, index) => (
              <Step key={index} active>
                <StepLabel
                  StepIconComponent={(props) => (
                    <CustomStepIcon
                      stepIcon={step.icon}
                      active={Boolean(props.active)}
                      icon={undefined}
                    />
                  )}
                >
                  <Typography variant="h5">{step.label}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {step.description}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Link href={"/demo/barber"}>
              <Button variant="contained" size="small">
                Try Customer Demo
              </Button>
            </Link>

            <Link href={"/register"}>
              <Button variant="contained" size="small">
                Try Dashboard Demo
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
}

export default HowItWorks;
