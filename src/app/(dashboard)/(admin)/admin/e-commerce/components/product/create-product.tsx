"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  InputAdornment,
  MenuItem,
  Grid2,
  FormControlLabel,
  Checkbox,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import FileDropzone from "@/components/file-dropzone";
import { productTaxCodes } from "@/tax-codes/products";
import Add from "@/icons/untitled-ui/duocolor/add";
import Delete from "@/icons/untitled-ui/duocolor/delete";
import {
  addProduct,
  addProductImage,
  deleteAllProductImages,
  deleteProductImage,
} from "@/app/actions/actions";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/submit-button";
import { DraftImage } from "../../products/add/page";
import notify from "@/utils/toast";
import { useRouter } from "next/navigation";
import { adminPaths } from "@/paths";

interface FileType extends File {
  path?: string;
}

const initialState: { error?: string; success?: string } | null = null;

export default function CreateProduct({
  draftImages,
}: {
  draftImages: DraftImage[];
}) {
  const productCategoryAndTaxCode = productTaxCodes;
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const selectedId = event.target.value;
    const selectedItem = productTaxCodes.find((item) => item.id === selectedId);

    if (selectedItem) {
      setSelectedCategory(selectedId);
      setSelectedDescription(selectedItem.description);
      setSelectedName(selectedItem.name);
    }
  };

  const [isSizeBased, setIsSizeBased] = useState(true);
  const [sizes, setSizes] = useState<
    {
      sizeType: string | undefined;
      quantity: string | undefined;
    }[]
  >([]);

  const [size, setSize] = useState<{
    sizeType: string | undefined;
    quantity: string | undefined;
  }>({
    sizeType: "",
    quantity: "",
  });

  const [imageMsg, setImageMsg] = useState("");
  const [imgLoading, setImgLoading] = useState(false);

  const handleFilesDrop = useCallback(async (newFiles: FileType[]) => {
    setImgLoading(true);
    for (let i = 0; i < newFiles.length; i++) {
      const formData = new FormData();
      formData.append("fileName", newFiles[i].name);
      formData.append("image", newFiles[i]);
      const result = await addProductImage(formData);

      if (result?.error) {
        setImageMsg(result.error);
        setImgLoading(false);
        return;
      }
    }
    setImgLoading(false);
  }, []);

  const handleFileRemove = useCallback(async (id: string) => {
    const result = await deleteProductImage(id);

    if (result?.error) setImageMsg(result.error);
    if (result?.success) notify(result.success);
  }, []);

  const handleFilesRemoveAll = useCallback(async () => {
    const result = await deleteAllProductImages();

    if (result?.error) setImageMsg(result.error);
    if (result?.success) notify(result.success);
  }, []);

  const handleIsSizeBased = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSizeBased(event.target.checked);
  };

  const handleDelete = (sizeType: string) => {
    const filter = sizes.filter((size) => size.sizeType !== sizeType);
    setSizes(filter);
  };

  const handleAddSize = () => {
    const isAdded = () => {
      const result = sizes.filter(
        (addedSize) => addedSize.sizeType === size.sizeType
      );

      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    };

    if (isAdded()) {
      alert("Size already addedd");
      return;
    }

    setSizes((prev) => [...prev, size]);
    setSize({
      sizeType: "",
      quantity: "",
    });
  };

  const addProductAndSize = addProduct.bind(null, sizes, draftImages);
  const [state, formAction] = useFormState(addProductAndSize, initialState);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.success) router.push(adminPaths.dashboard.ecommerce.products);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  variant="outlined"
                  required
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <input defaultValue={selectedName} name="categoryName" hidden />

                <FormControl fullWidth required>
                  <InputLabel id="service-category-select-label">
                    Category
                  </InputLabel>
                  <Select
                    required
                    label="Category"
                    labelId="service-category-select-label"
                    name="categoryTaxCode"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    {productCategoryAndTaxCode.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {selectedDescription && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 2 }}
                    >
                      {selectedDescription}
                    </Typography>
                  )}
                </FormControl>
              </Grid2>

              {/* Description */}
              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Grid2>

              {/* Price */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  variant="outlined"
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    },
                    htmlInput: { step: "any" },
                  }}
                />
              </Grid2>

              {/* Optional Details */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  name="expiryDate"
                  type="date"
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="SKU"
                  name="SKU"
                  variant="outlined"
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Barcode"
                  name="barcode"
                  variant="outlined"
                />
              </Grid2>
            </Grid2>

            <Stack direction={"row"} spacing={2}>
              <FormControlLabel
                label="Size based quantity"
                control={
                  <Checkbox
                    name="sizeBased"
                    checked={isSizeBased}
                    onChange={handleIsSizeBased}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
              />
            </Stack>

            {isSizeBased ? (
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12 }}>
                  {sizes.length > 0 ? (
                    sizes.map((size, sizeindex) => {
                      return (
                        <Stack
                          key={sizeindex}
                          direction={"row"}
                          justifyContent={"space-between"}
                          sx={{ maxWidth: { md: "30%" }, px: { xs: 2 }, mb: 2 }}
                        >
                          <Typography variant="body1">{`${size.sizeType} - ${size.quantity}`}</Typography>
                          <IconButton
                            onClick={() => handleDelete(size.sizeType!)}
                            sx={{ p: 0 }}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      );
                    })
                  ) : (
                    <Typography color="info" variant="subtitle2">
                      {" "}
                      No size added
                    </Typography>
                  )}
                </Grid2>
                <Grid2 size={{ xs: 6, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Size type"
                    variant="outlined"
                    value={size.sizeType}
                    onChange={(e) =>
                      setSize((prev) => {
                        return {
                          sizeType: e.target.value,
                          quantity: prev.quantity,
                        };
                      })
                    }
                    name="Size-type"
                    type="text"
                    placeholder="e.g md"
                  />
                </Grid2>
                <Grid2 size={{ xs: 6, md: 6 }}>
                  {" "}
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={size.quantity}
                    onChange={(e) =>
                      setSize((prev) => {
                        return {
                          quantity: e.target.value,
                          sizeType: prev.sizeType,
                        };
                      })
                    }
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 12 }}>
                  <Button
                    disabled={!size.quantity || !size.sizeType}
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddSize}
                  >
                    Add
                  </Button>
                </Grid2>
              </Grid2>
            ) : (
              <TextField
                fullWidth
                variant="outlined"
                label="Quantity"
                name="quantity"
              />
            )}

            <Stack spacing={2}>
              <Typography variant="subtitle2" color="error">
                {imageMsg}
              </Typography>
              {imgLoading && <CircularProgress />}
              <FileDropzone
                accept={{ "image/*": [] }}
                caption="(SVG, JPG, or PNG. Ensure product is well centeered in the photo)"
                files={draftImages}
                onDrop={handleFilesDrop}
                onRemove={handleFileRemove}
                onRemoveAll={handleFilesRemoveAll}
              />
            </Stack>

            <Stack direction={"row"} spacing={2}>
              <FormControlLabel
                label="Sell Only with appointment"
                control={
                  <Checkbox
                    name="sellOnlyWithAppointment"
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Typography color="error" variant="subtitle2">
        {message}
      </Typography>

      <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
        <SubmitButton title="Add Product" isFullWidth={false} />
      </Stack>
    </form>
  );
}
