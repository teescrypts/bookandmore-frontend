import apiRequest from "@/utils/api-request";
import React from "react";
import BlogList from "../components/blog/blog-list";

export interface CustomerBlogType {
  _id: string;
  title: string;
  shortDescription: string;
  author: string;
  estReadTime: string;
  content: string;
  coverImage: {
    url: string;
    fileName: string;
    imageId: string;
  };
  engagements: { likes: number; comments: number; shares: number };
}

interface Response {
  error?: string;
  message?: CustomerBlogType[];
}

async function Page() {
  const response = await apiRequest<Response>("/api/customer/fetch/blogs", {
    tag: "fetchBlogs",
  });

  if (response?.error) throw new Error(response.error);

  const blogs = response.message!;

  return <BlogList blogs={blogs} />;
}

export default Page;
