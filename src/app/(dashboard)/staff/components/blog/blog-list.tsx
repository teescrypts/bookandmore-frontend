"use client";

import { Grid2 } from "@mui/material";
import BlogCard from "./blog-card";
import { BlogType } from "../../blog/page";
import EmptyState from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { staffPaths } from "@/paths";

const BlogPage = ({ blogs }: { blogs: BlogType[] }) => {
  const router = useRouter();

  if (blogs.length === 0) {
    return (
      <EmptyState
        message="You have not added any blog"
        actionLabel="Add blog"
        onActionClick={() => router.push(staffPaths.dashboard.blog.add)}
      />
    );
  }

  return (
    <Grid2 container spacing={2}>
      {blogs.map((blog, index) => (
        <Grid2 size={{ xs: 12, md: 6, lg: 6 }} key={index}>
          <BlogCard {...blog} />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default BlogPage;
