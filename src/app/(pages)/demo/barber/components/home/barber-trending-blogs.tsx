import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Container,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { HomeBlogType } from "../../page";
import truncateWords from "@/utils/truncated-words";

interface PropType {
  blogs: HomeBlogType[];
}

const BarberTrendingBlogs: React.FC<PropType> = ({ blogs }) => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 8, px: { xs: 2, md: 6 }, bgcolor: "background.paper" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Trending Blogs
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Stay updated with the latest grooming tips and trends
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia>
                  <img
                    src={blog.coverImage.url}
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
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    gutterBottom
                  >
                    {blog.estReadTime} min • By {blog.author}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {truncateWords(blog.shortDescription, 15)}
                  </Typography>
                  <Link href={`/demo/barber/blog/${blog._id}`} passHref>
                    <Button variant="outlined" color="primary">
                      Read More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" mt={6}>
          <Link href="/demo/barber/blog" passHref>
            <Button variant="contained" color="secondary">
              View All Blogs
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default BarberTrendingBlogs;
