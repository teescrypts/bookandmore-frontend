"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DOMPurify from "dompurify";
import Favorite from "@/icons/untitled-ui/duocolor/favorite";
import Share07 from "@/icons/untitled-ui/duocolor/share-07";
import Comments from "@/icons/untitled-ui/duocolor/comment";
import { CustomerBlogType } from "../../blog/page";
import { formatDistanceToNow } from "date-fns";

type CommentType = {
  author: string;
  content: string;
  createdAt: string;
};

const dummyComments = [
  {
    author: "John Doe",
    content: "Amazing blog! Loved it.",
    createdAt: "2024-12-01T10:30:00Z",
  },
  {
    author: "Jane Smith",
    content: "Great insights, thanks for sharing!",
    createdAt: "2024-12-02T14:15:00Z",
  },
  {
    author: "Samuel Lee",
    content: "Very helpful. Keep it up!",
    createdAt: "2024-12-03T09:00:00Z",
  },
  {
    author: "Emily Davis",
    content: "Found this super informative.",
    createdAt: "2024-12-03T16:45:00Z",
  },
  {
    author: "Michael Brown",
    content: "Fantastic read!",
    createdAt: "2024-12-04T08:20:00Z",
  },
  {
    author: "Sophia Wilson",
    content: "Thanks for the tips!",
    createdAt: "2024-12-05T12:45:00Z",
  },
  {
    author: "Liam Taylor",
    content: "Looking forward to more!",
    createdAt: "2024-12-06T07:25:00Z",
  },
];

interface PropType {
  blog: CustomerBlogType;
}

const BlogPage: React.FC<PropType> = ({ blog }) => {
  const [comment, setComment] = useState("");
  const [visibleComments, setVisibleComments] = useState(3);

  const handleLoadMore = () => {
    setVisibleComments((prev) => prev + 3);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 21, p: 4 }}>
      {/* Blog Header */}
      <Box mb={4}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {blog.estReadTime} min read • By {blog.author}
        </Typography>

        <Typography variant="subtitle1" color="textSecondary">
          {blog.shortDescription}
        </Typography>
      </Box>

      {/* Blog Cover Image */}
      <CardMedia
        component="img"
        src={blog.coverImage.url}
        alt={blog.title}
        sx={{
          borderRadius: 2,
          maxHeight: 450,
          objectFit: "cover",
          mb: 4,
          transition: "transform 0.3s",
          "&:hover": { transform: "scale(1.02)" },
        }}
      />

      {/* Blog Content */}

      <Box
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(blog.content),
        }}
      />

      <Divider />

      {/* Engagement Section */}
      {/* <Stack direction="row" spacing={2} justifyContent="flex-start">
        <IconButton
          color="primary"
          //   onClick={() => handleEngagement("like")}
          sx={{
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.2)" },
          }}
        >
          <Favorite />
        </IconButton>
        <Typography>{blog.engagements.likes}</Typography>

        <IconButton
          color="secondary"
          //   onClick={() => handleEngagement("share")}
          sx={{
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.2)" },
          }}
        >
          <Share07 />
        </IconButton>
        <Typography>{blog.engagements.shares}</Typography>
      </Stack> */}

      {/* Comment Section */}
      {/* <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {dummyComments.slice(0, visibleComments).map((comment, index) => (
          <Box key={index} display="flex" alignItems="flex-start" mb={3}>
            <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
              {comment.author[0]}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {comment.author}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {formatDistanceToNow(new Date(comment.createdAt))} ago
              </Typography>
              <Typography variant="body2" mt={1}>
                {comment.content}
              </Typography>
            </Box>
          </Box>
        ))}
        {visibleComments < dummyComments.length && (
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            sx={{ display: "block", margin: "0 auto" }}
          >
            Load More
          </Button>
        )}
      </Box> */}

      {/* Add Comment Section */}
      {/* <CardContent
        sx={{
          background: "#f9f9f9",
          borderRadius: 2,
          p: 3,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add a Comment
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          //   endIcon={<Send />}
          //   onClick={() => handleEngagement("comment")}
          disabled={!comment.trim()}
        >
          Submit
        </Button>
      </CardContent> */}
    </Container>
  );
};

export default BlogPage;
