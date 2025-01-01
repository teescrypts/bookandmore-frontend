"use client";

import { Container, Grid2, Pagination } from "@mui/material";
import React, { useState } from "react";
import { CustomerBlogType } from "../../blog/page";
import BlogCard from "./blog-card";
import EmptyState from "@/components/empty-state";

const BlogList: React.FC<{ blogs: CustomerBlogType[] }> = ({ blogs }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjust as needed
  const totalPages = Math.ceil(blogs.length / itemsPerPage);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  // Get blogs for the current page
  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 25 }}>
      <Grid2 container spacing={2}>
        {blogs.length > 0 ? (
          paginatedBlogs.map((blog, index) => (
            <Grid2 size={{ xs: 12, md: 4 }} key={index}>
              <BlogCard blog={blog} />
            </Grid2>
          ))
        ) : (
          <EmptyState message="We're currently setting things up. Our blog isn't live yet—please check back soon!" />
        )}
      </Grid2>

      {/* Pagination */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
      />
    </Container>
  );
};

export default BlogList;
