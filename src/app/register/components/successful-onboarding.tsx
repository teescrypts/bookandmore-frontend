import { Box, Typography, Button, Stack } from "@mui/material";
import { useRouter } from "next/navigation";

const SuccessfulOnboarding: React.FC = () => {
  const router = useRouter();

  const handleGoToLogin = () => {
    router.push("/demo/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        backgroundColor: "background.default",
      }}
    >
      <Stack
        spacing={2}
        alignItems="center"
        sx={{
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Welcome Aboard! 🎉
        </Typography>
        <Typography variant="body1">
          You have successfully completed the onboarding process. Start
          exploring our platform now!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoToLogin}
          size="large"
          sx={{
            mt: 2,
            px: 4,
          }}
        >
          Go to Login
        </Button>
      </Stack>
    </Box>
  );
};

export default SuccessfulOnboarding;
