"use client";

import FileDropzone from "@/components/file-dropzone";
import { QuillEditor } from "@/components/quil-editor";
import { SubmitButton } from "@/components/submit-button";
import { API_BASE_URL } from "@/paths";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { BlogType } from "../../blog/page";
import { updateBlog, uploadBlogImage } from "@/app/actions/actions";
import { useFormState } from "react-dom";
import notify from "@/utils/toast";

const initialState: { error?: string; success?: string } | null = null;

function UpdateBlog({ blog }: { blog: BlogType }) {
  const [cover, setCover] = useState<{
    url: string;
    imageId: string;
    fileName: string;
  }>({
    url: blog.coverImage.url,
    imageId: blog.coverImage.imageId,
    fileName: blog.coverImage.fileName,
  });

  const [content, setContent] = useState(blog.content);

  const [imgMsg, setImgMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCoverDrop = useCallback(async ([file]: File[]) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("fileName", file.name);
    formData.append("image", file);
    const result = await uploadBlogImage(formData);

    if (result?.error) {
      setImgMsg(result.error);
      setLoading(false);
    } else {
      const image = result.success;
      setCover({
        url: `${API_BASE_URL}/blogs/${image!.imageId}/image?name=${
          image!.fileName
        }`,
        imageId: image!.imageId,
        fileName: image!.fileName,
      });
      setLoading(false);
    }
  }, []);

  const updateBlogWithImage = updateBlog.bind(null, cover);

  const [message, setMessage] = useState("");
  const [state, formAction] = useFormState(updateBlogWithImage, initialState);

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.success) notify(state.success);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="h6">Basic details</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Stack spacing={3}>
                  <input name="id" defaultValue={blog._id} hidden />
                  <TextField
                    variant="outlined"
                    fullWidth
                    defaultValue={blog.title}
                    label="Post title"
                    name="title"
                  />
                  <TextField
                    variant="outlined"
                    fullWidth
                    defaultValue={blog.shortDescription}
                    label="Short description"
                    name="shortDescription"
                    multiline
                    minRows={3}
                  />
                  <TextField
                    name="author"
                    defaultValue={blog.author}
                    variant="outlined"
                    fullWidth
                    label="Aurthor"
                  />
                  <TextField
                    name="estReadTime"
                    type="number"
                    variant="outlined"
                    fullWidth
                    label="Estimated Read Time"
                    slotProps={{ htmlInput: { min: 1 } }}
                  />
                </Stack>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="h6">Post cover</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Typography color="error" variant="subtitle2">
                  {imgMsg}
                </Typography>
                {loading && <CircularProgress />}
                <Stack spacing={3}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 500,
                      mt: 3,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={cover.url}
                      alt="Blog Cover"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <FileDropzone
                    accept={{ "image/*": [] }}
                    maxFiles={1}
                    onDrop={handleCoverDrop}
                    caption="(SVG, JPG, PNG, or gif maximum 900x400)"
                  />
                </Stack>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="h6">Content</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <QuillEditor
                  value={content}
                  onChange={(value: string) => {
                    setContent(value);
                  }}
                  placeholder="Write something"
                  sx={{ height: 330 }}
                />
                <input
                  value={content}
                  onChange={() => {}}
                  hidden
                  name="content"
                />
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
      </Stack>

      <Typography color="error" textAlign={"center"} variant="subtitle2">
        {message}
      </Typography>

      <Stack
        sx={{
          mt: 2,
        }}
        justifyContent={"flex-end"}
        direction={"row"}
      >
        <SubmitButton title="Update blog" isFullWidth={false} />
      </Stack>
    </form>
  );
}

export default UpdateBlog;
