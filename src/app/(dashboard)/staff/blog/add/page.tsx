import React from "react";
import AddBlog from "../../components/blog/add-blog";
import { BreadcrumbsSeparator } from "@/components/breadcrumbs-separatr";
import { RouterLink } from "@/components/router-link";
import {
  Box,
  Container,
  Stack,
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import { staffPaths } from "@/paths";

export interface BlogDraftImageType {
  _id: string;
  url: string;
  fileName: string;
  imageId: string;
}

interface Response {
  error?: string;
  message?: BlogDraftImageType | string;
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/blogs/image", {
    token: session,
    tag: "fetchBlogImageDraft",
  });

  if (response?.error) throw new Error(response.error);
  const draftImg = response.message!;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={1}>
          <Typography variant="h3">Publish Blog</Typography>
          <Breadcrumbs separator={<BreadcrumbsSeparator />}>
            <Link
              color="text.primary"
              component={RouterLink}
              href={staffPaths.dashboard.blog.index}
              variant="subtitle2"
            >
              Blog
            </Link>
            <Typography color="text.secondary" variant="subtitle2">
              Create
            </Typography>
          </Breadcrumbs>
        </Stack>
        <AddBlog draftImg={draftImg} />
      </Container>
    </Box>
  );
}

export default Page;
