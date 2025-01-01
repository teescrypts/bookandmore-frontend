"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  InputAdornment,
  MenuItem,
  Grid2,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Delete from "@/icons/untitled-ui/duocolor/delete";
import Add from "@/icons/untitled-ui/duocolor/add";
import FileDropzone from "@/components/file-dropzone";
import { Product } from "../../products/page";
import { SubmitButton } from "@/components/submit-button";
import { productTaxCodes } from "@/tax-codes/products";
import { format } from "date-fns";
import {
  addProductImage,
  deleteProductImage,
  updateProduct,
} from "@/app/actions/actions";
import notify from "@/utils/toast";
import { useFormState } from "react-dom";

interface FileType extends File {
  path?: string;
}

const initialState: { error?: string; success?: string } | null = null;

export default function EditProduct({ product }: { product: Product }) {
  const productCategoryAndTaxCode = productTaxCodes;
  const [selectedCategory, setSelectedCategory] = useState<string>(
    product.category.taxCode
  );
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");
  const [updatedImages, setUpdatedImages] = useState<
    { url: string; fileName: string; imageId: string }[]
  >(product.images);

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const selectedId = event.target.value;
    setSelectedCategory(selectedId);
  };

  useEffect(() => {
    if (selectedCategory) {
      const currentItem = productTaxCodes.find(
        (item) => item.id === selectedCategory
      );

      if (currentItem) {
        setSelectedDescription(currentItem.description);
        setSelectedName(currentItem.name);
      }
    }
  }, [selectedCategory]);

  const [isSizeBased, setIsSizeBased] = useState(
    product.sizeBasedQuantity?.enabled
  );

  const [sizes, setSizes] = useState<
    {
      sizeType: string;
      quantity: string;
    }[]
  >([]);

  useEffect(() => {
    if (isSizeBased) {
      const sizeBasedQuantity = product.sizeBasedQuantity.details;
      const sizes = sizeBasedQuantity!.map((size) => {
        return {
          sizeType: size.sizeType,
          quantity: `${size.quantity}`,
        };
      });
      setSizes(sizes);
    }
  }, [isSizeBased]);

  const [size, setSize] = useState<{
    sizeType: string | undefined;
    quantity: string | undefined;
  }>({
    sizeType: undefined,
    quantity: undefined,
  });

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

    setSizes((prev) => [
      ...prev,
      { sizeType: size.sizeType!, quantity: size.quantity! },
    ]);

    setSize({
      sizeType: "",
      quantity: "",
    });
  };

  const [imageMsg, setImageMsg] = useState("");
  const [imgLoading, setImgLoading] = useState(false);

  const handleFilesDrop = useCallback(async (newFiles: FileType[]) => {
    setImgLoading(true);
    for (let i = 0; i < newFiles.length; i++) {
      const formData = new FormData();
      formData.append("fileName", newFiles[i].name);
      formData.append("image", newFiles[i]);
      const result = await addProductImage(formData, product._id);

      if (result?.error) {
        setImageMsg(result.error);
        setImgLoading(false);
        return;
      }

      const newDraft = result.success!;
      const newImg = {
        url: `products/${newDraft.imageId}/image`,
        fileName: newDraft.fileName,
        imageId: newDraft.imageId,
      };

      setUpdatedImages((prev) => [...prev, newImg]);
    }
    setImgLoading(false);
  }, []);

  const handleFileRemove = useCallback(async (id: string) => {
    if (product.images.length === 1) {
      alert("There must be atleast one image for each product");
      return;
    }

    const result = await deleteProductImage(id, product._id);

    if (result?.error) setImageMsg(result.error);
    if (result?.success) {
      setUpdatedImages((prev) => {
        const newUpdates = prev.filter((img) => img.imageId !== id);
        return newUpdates;
      });
      notify(result.success);
    }
  }, []);

  const addImagesAndSize = updateProduct.bind(null, sizes, updatedImages);
  const [state, formAction] = useFormState(addImagesAndSize, initialState);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.success) notify(state.success);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12 }}>
                <input defaultValue={product._id} name="id" hidden />
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  defaultValue={product.name}
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
                  defaultValue={product.description}
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
                  defaultValue={product.price}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    },
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
                  defaultValue={
                    product?.expiryDate &&
                    format(new Date(product.expiryDate), "yyyy-MM-dd")
                  }
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="SKU"
                  defaultValue={product.SKU}
                  name="SKU"
                  variant="outlined"
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Barcode"
                  name="barcode"
                  defaultValue={product.barcode}
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
                    sizes.map((size) => {
                      return (
                        <Stack
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
                defaultValue={product.quantity}
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
                files={product.images}
                onDrop={handleFilesDrop}
                onRemove={handleFileRemove}
                isEdit={true}
              />
            </Stack>

            <Stack direction={"row"} spacing={2}>
              <FormControlLabel
                label="Sell Only with appointment"
                control={
                  <Checkbox
                    checked={product.sellOnlyWithAppointment}
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

      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 2 }}
        justifyContent={"flex-end"}
      >
        <SubmitButton title="Save Changes" isFullWidth={false} />
      </Stack>
    </form>
  );
}
