export const dynamic = 'force-dynamic'

import React from "react";
import BlogPage from "../components/blog/blog-list";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { RouterLink } from "@/components/router-link";
import Add from "@/icons/untitled-ui/duocolor/add";
import { getSession } from "@/utils/get-session";
import apiRequest from "@/utils/api-request";
import { Metadata } from "next";
import { staffPaths } from "@/paths";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Manage Blogs",
  openGraph: {
    title: "Book and more",
    description: "The All in one website for Barber brands and shops",
    url: "https://bookandmore.live",
    siteName: "Book and More",
    images: [
      {
        url: "https://bookandmore.live/assets/imgs/impact-logo.png", // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export interface BlogType {
  _id: string;
  title: string;
  shortDescription: string;
  author: string;
  content: string;
  coverImage: { url: string; fileName: string; imageId: string };
  engagements: {
    likes: number;
    comments: number;
    shares: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface Response {
  error?: string;
  message?: BlogType[];
}

async function Page() {
  const session = await getSession();
  const response = await apiRequest<Response>("/api/blogs", {
    token: session,
    tag: "fetchBlogs",
  });

  if (response?.error) throw new Error(response.error);

  const blogs = response.message!;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <Stack spacing={1}>
              <Typography variant="h4">Blog</Typography>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={3}>
              <Button
                component={RouterLink}
                href={staffPaths.dashboard.blog.add}
                startIcon={
                  <SvgIcon>
                    <Add />
                  </SvgIcon>
                }
                variant="contained"
              >
                Add New Blog
              </Button>
            </Stack>
          </Stack>
          <BlogPage blogs={blogs} />
        </Stack>
      </Container>
    </Box>
  );
}

export default Page;
