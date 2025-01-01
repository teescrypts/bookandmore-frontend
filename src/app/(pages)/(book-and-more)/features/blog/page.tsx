import { Stack } from "@mui/material";
import React from "react";
import Banner from "../../components/banner";
import FeaturePage from "../../components/feature-page";

function Page() {
  return (
    <Stack spacing={6}>
      <Banner
        title="Centralize Your Blog Management"
        subtitle="Easily create, edit, and organize blog posts from a single, convenient dashboard."
      />
      <FeaturePage
        title="Blog"
        description="Create, edit, and publish blog content seamlessly from your dashboard. Organize posts and manage all aspects of your blog in one place, making it easy to keep your content fresh and engaging."
        image="/assets/imgs/blog.png"
      />
    </Stack>
  );
}

export default Page;
