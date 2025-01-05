import React from "react";
import UpdateBlog from "../../components/blog/update-blog";
import apiRequest from "@/utils/api-request";
import { getSession } from "@/utils/get-session";
import { ResolvingMetadata, Metadata } from "next";
import { BlogType } from "../page";
import { BreadcrumbsSeparator } from "@/components/breadcrumbs-separatr";
import { RouterLink } from "@/components/router-link";
import { adminPaths } from "@/paths";
import {
  Box,
  Container,
  Stack,
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

interface Response {
  error?: string;
  message?: BlogType;
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  const session = await getSession();
  const response = await apiRequest<Response>(`/api/blogs/${id}`, {
    token: session,
    tag: "fetchBlog",
  });

  let name;
  if (response?.error) {
    name = "Error";
  } else {
    name = response.message!.title;
  }
  
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: name,
    openGraph: {
      images: [
        "https://bookandmore.live/assets/imgs/impact-logo.png",
        ...previousImages,
      ],
    },
  };
}

async function Page({ params }: { params: { id: string } }) {
  const session = await getSession();
  const response = await apiRequest<Response>(`/api/blogs/${params.id}`, {
    token: session,
    tag: "fetchBlog",
  });

  if (response?.error) throw new Error(response.error);

  const blog = response.message!;

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
          <Typography variant="h3">Update Blog</Typography>
          <Breadcrumbs separator={<BreadcrumbsSeparator />}>
            <Link
              color="text.primary"
              component={RouterLink}
              href={adminPaths.dashboard.blog.index}
              variant="subtitle2"
            >
              Blog
            </Link>
            <Typography color="text.secondary" variant="subtitle2">
              Create
            </Typography>
          </Breadcrumbs>
        </Stack>
        <UpdateBlog blog={blog} />
      </Container>
    </Box>
  );
}

export default Page;
