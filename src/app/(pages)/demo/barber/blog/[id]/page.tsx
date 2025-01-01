import apiRequest from "@/utils/api-request";
import React from "react";
import { CustomerBlogType } from "../page";
import BlogPage from "../../components/blog/blog-page";

interface Response {
  error?: string;
  message?: CustomerBlogType;
}

async function Page({ params }: { params: { id: string } }) {
  const response = await apiRequest<Response>(
    `/api/customer/fetch/blogs/${params.id}`,
    {
      tag: "fetchCustomerBlog",
    }
  );

  if (response?.error) throw new Error(response.error);

  const blog = response.message!;

  return <BlogPage blog={blog} />;
}

export default Page;
