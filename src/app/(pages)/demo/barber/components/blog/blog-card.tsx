import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid2,
} from "@mui/material";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { CustomerBlogType } from "../../blog/page";
import { API_BASE_URL } from "@/paths";
import truncateWords from "@/utils/truncated-words";

function BlogCard({ blog }: { blog: CustomerBlogType }) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardMedia>
        <img
          src={`${blog.coverImage.url}`}
          alt={blog.title}
          width={400}
          height={250}
          style={{ objectFit: "cover", borderRadius: "8px" }}
        />
      </CardMedia>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="caption" color="textSecondary" gutterBottom>
          {blog.estReadTime} • By {blog.author}
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          {truncateWords(blog.shortDescription, 20)}
        </Typography>
        <Link href={`/demo/barber/blog/${blog._id}`} passHref>
          <Button variant="outlined" color="primary">
            Read More
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default BlogCard;
