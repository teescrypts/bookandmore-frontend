import { Paper } from "@mui/material";
import Image from "next/image";
import React from "react";

function AuthPaper() {
  return (
    <Paper
      elevation={4}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.paper",
        p: { xs: 2, md: 4 },
        width: { xs: "100%", md: "40vw" },
      }}
    >
      <Image
        height={400}
        width={380}
        alt="Barber Chair"
        src="/assets/imgs/barber-banner-img.png"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </Paper>
  );
}

export default AuthPaper;
