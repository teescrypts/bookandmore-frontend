"use client";

import {
  deleteBlogDraftImage,
  publishBlog,
  uploadBlogImage,
} from "@/app/actions/actions";
import FileDropzone from "@/components/file-dropzone";
import { QuillEditor } from "@/components/quil-editor";
import { adminPaths, API_BASE_URL } from "@/paths";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { BlogDraftImageType } from "../../blog/add/page";
import notify from "@/utils/toast";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/submit-button";
import { useRouter } from "next/navigation";

const initialState: { error?: string; success?: string } | null = null;

function AddBlog({ draftImg }: { draftImg: BlogDraftImageType | string }) {
  const [cover, setCover] = useState<{
    url: string;
    imageId: string;
    fileName: string;
  } | null>(
    typeof draftImg === "string"
      ? null
      : {
          url: `${API_BASE_URL}/${draftImg.url}?name=${draftImg.fileName}`,
          imageId: draftImg.imageId,
          fileName: draftImg.fileName,
        }
  );

  const [content, setContent] = useState("");

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

  const handleCoverRemove = useCallback(async (id: string) => {
    const result = await deleteBlogDraftImage(id);

    if (result?.error) setImgMsg(result.error);
    if (result?.success) notify(result.success);
  }, []);

  const publishBlogWithImage = publishBlog.bind(null, cover);
  const [message, setMessage] = useState("");
  const [state, formAction] = useFormState(publishBlogWithImage, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.success) router.push(adminPaths.dashboard.blog.index);
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
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Post title"
                    name="title"
                  />
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Short description"
                    name="shortDescription"
                    multiline
                    minRows={3}
                  />
                  <TextField
                    name="author"
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
                  {cover ? (
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
                  ) : (
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        border: 1,
                        borderRadius: 1,
                        borderStyle: "dashed",
                        borderColor: "divider",
                        height: 230,
                        mt: 3,
                        p: 3,
                      }}
                    >
                      <Typography
                        align="center"
                        color="text.secondary"
                        variant="h6"
                      >
                        Select a cover image
                      </Typography>
                      <Typography
                        align="center"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                        variant="subtitle1"
                      >
                        Image used for the blog post cover and also for Open
                        Graph meta
                      </Typography>
                    </Box>
                  )}
                  {typeof draftImg !== "string" && (
                    <div>
                      <Button
                        color="inherit"
                        disabled={!cover}
                        onClick={() => handleCoverRemove(draftImg._id)}
                      >
                        Remove photo
                      </Button>
                    </div>
                  )}
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
                  onChange={(value: string) => setContent(value)}
                  placeholder="Write something"
                  sx={{ height: 330 }}
                />
                <input defaultValue={content} hidden name="content" />
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
        <SubmitButton title="Publish blog" isFullWidth={false} />
      </Stack>
    </form>
  );
}

export default AddBlog;
