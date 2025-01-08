"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Typography,
  IconButton,
  Button,
  Rating,
  Stack,
  TextField,
  Divider,
  Container,
  Grid2,
  MenuItem,
  Select,
  Link,
  Badge,
} from "@mui/material";
import ShoppingCart01 from "@/icons/untitled-ui/duocolor/shopping-cart-01";
import { CustomerProduct } from "../../shop/[branch]/[id]/page";
import { ValidCouponType } from "@/app/actions/action-types";
import { BreadcrumbsSeparator } from "@/components/breadcrumbs-separatr";
import { RouterLink } from "@/components/router-link";
import { useClientData } from "@/app/authentication/frontend/auth-context";
import { CartItemType } from "./shop-page";
import {
  addToCart,
  getCartItemCountLoggedInUser,
  mergeCart,
} from "@/app/actions/actions";
import notify from "@/utils/toast";
import { useRouter } from "next/navigation";
import { localStorageExtCart } from "./cart";

// const reviews = [
//   { username: "John Combs", comment: "I love this product", rating: 4 },
//   { username: "Kahl King", comment: "It's good", rating: 2 },
//   { username: "Enderson Burray", comment: "I love this product", rating: 3 },
// ];

function ProductPage({
  branch,
  product,
  validCoupons,
}: {
  branch: string;
  product: CustomerProduct;
  validCoupons: ValidCouponType[];
}) {
  const [selectedImage, setSelectedImage] = useState<string>(
    product.images[0]?.url
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [cartItemCount, setCartItemCount] = useState(0);
  const router = useRouter();

  const { isGuest } = useClientData();

  const getCartItemCount = useCallback(async () => {
    const cartItems = localStorage.getItem("cart");

    if (cartItems && isGuest) {
      const cartItemsArr = JSON.parse(cartItems);
      const cartItemCountBranch = cartItemsArr.filter(
        (item: CartItemType) => item.branch === branch
      );
      const cartItemCount = cartItemCountBranch.length;
      setCartItemCount(cartItemCount);
    }

    if (!isGuest) {
      const result = await getCartItemCountLoggedInUser(branch);

      if (result?.error) throw new Error(result.error);
      if (result?.success) setCartItemCount(result.success);
    }
  }, [isGuest]);

  const mergeCartItems = useCallback(async () => {
    const existingCarts = localStorage.getItem("cart");

    if (existingCarts && !isGuest) {
      const existingCartArr: localStorageExtCart[] = JSON.parse(existingCarts);

      const existingCartArrBranch = existingCartArr.filter(
        (item: localStorageExtCart) => item.branch === branch
      );

      for (let i = 0; i < existingCartArrBranch.length; i++) {
        const product = existingCartArrBranch[i].product;
        const quantity = existingCartArrBranch[i].quantity;
        const result = await mergeCart(product._id, quantity, branch);

        if (result?.error) throw new Error(result.error);
      }

      localStorage.removeItem("cart");
    }
  }, [isGuest]);

  useEffect(() => {
    mergeCartItems();
    getCartItemCount();
  }, [isGuest]);

  const coupon = validCoupons.find((coupon) =>
    coupon.addedProducts.some((p) => p._id === product._id)
  );

  const calculateDiscountedPrice = () => {
    if (!coupon) return product.price;

    const discountValue =
      coupon.valueType === "percent_off"
        ? (coupon.value / 100) * product.price
        : coupon.value;

    return Math.max(0, product.price - discountValue);
  };

  const discountedPrice = calculateDiscountedPrice();

  const handleQuantityChange = (amount: number, inStock?: number) => {
    const newQuantity = Math.min(
      Math.max(1, quantity + amount),
      inStock ?? Infinity
    );
    setQuantity(newQuantity);
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
  };

  const availableSizes = product.sizeBasedQuantity?.details?.filter(
    (size) => size.quantity && size.quantity > 0
  );

  const isSizeBased = product.sizeBasedQuantity?.enabled;

  const handleCartGuest = (
    productId: string,
    name: string,
    price: number,
    images: {
      url: string;
      fileName?: string;
      imageId: string;
    }[],
    sizeBasedQuantity: {
      enabled: boolean;
      details: { sizeType?: string; quantity?: number }[];
    },
    sizeBased: boolean,
    inStock: number // Fix case to match convention
  ) => {
    const selectedSizeValue = sizeBased ? selectedSize : undefined;

    // Retrieve and parse the existing cart
    const cart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    ) as CartItemType[];

    // Create a quick lookup map for the cart items
    const cartMap = new Map(
      cart.map((item) => [
        `${item.product._id}-${
          item.quantity.sizeBasedQuantity?.size || "none"
        }`,
        item,
      ])
    );

    const cartKey = `${productId}-${selectedSizeValue || "none"}`;

    // Check if product is out of stock
    if (inStock === 0) {
      alert("Product is out of stock");
      return; // Exit early as no further processing is needed
    }

    if (cartMap.has(cartKey)) {
      // Retrieve existing item
      const existingItem = cartMap.get(cartKey)!;

      // Calculate the resulting quantity
      const newQuantity = existingItem.quantity.value + quantity;

      if (newQuantity > inStock) {
        // Alert user if the new quantity exceeds the stock
        alert(`Cannot add more. Only ${inStock} items in stock.`);
        return; // Exit early
      }

      if (newQuantity === inStock) {
        // Alert user if the new quantity equals the stock
        alert(`Note: Only ${inStock} items available.`);
      }

      // Update the quantity
      existingItem.quantity.value = newQuantity;
    } else {
      // Adding new item to cart
      const newCartItem: CartItemType = {
        product: {
          _id: productId,
          name,
          price,
          images,
          sizeBasedQuantity,
        },
        quantity: {
          sizeBasedQuantity: {
            enabled: sizeBased,
            ...(sizeBased && { size: selectedSizeValue }),
          },
          value: quantity, // Default value for new item
        },
        branch,
      };

      cartMap.set(cartKey, newCartItem);
    }

    // Convert map back to array for storage
    const updatedCart = Array.from(cartMap.values());

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Update cart count and notify success
    getCartItemCount();
    notify("Product added to cart");
  };

  const handleCartLoggedIn = async (
    productId: string,
    sizeBased: boolean,
    instock: number
  ) => {
    const result = await addToCart(
      instock,
      branch,
      productId,
      sizeBased,
      selectedSize,
      quantity
    );

    if (result?.error) alert(result.error);
    if (result.success) {
      getCartItemCount();
      notify(result.success);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 25 }}>
        <Breadcrumbs sx={{ my: 2 }} separator={<BreadcrumbsSeparator />}>
          <Link
            color="text.primary"
            component={RouterLink}
            href={`/demo/barber/shop/${branch}`}
            variant="subtitle2"
          >
            Shop
          </Link>
          <Typography color="text.secondary" variant="subtitle2">
            Product details
          </Typography>
        </Breadcrumbs>

        <Grid2 container spacing={4}>
          {/* Product Images */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2 }}
            >
              <img
                src={selectedImage}
                alt={product.name}
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                }}
              />
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                {product.images.map((image) => (
                  <IconButton
                    key={image.imageId}
                    onClick={() => handleImageClick(image.url)}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail`}
                      style={{
                        width: 50,
                        height: 50,
                        border:
                          selectedImage === image.url
                            ? "2px solid #1976d2"
                            : "1px solid #ddd",
                      }}
                    />
                  </IconButton>
                ))}
              </Stack>
            </Box>
          </Grid2>

          {/* Product Details */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box sx={{ maxWidth: 500 }}>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Category: {product.category.name}
              </Typography>
              {/* <Rating
                value={3}
                readOnly
                precision={0.5}
                icon={<Star />}
                emptyIcon={<StarBorder />}
              /> */}
              <Typography variant="body2" color="text.secondary">
                {product.description || "No description available"}
              </Typography>

              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mt: 2 }}
              >
                <Typography variant="h5" color="primary">
                  ${discountedPrice.toFixed(2)}
                </Typography>
                {discountedPrice < product.price && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: "line-through" }}
                  >
                    ${product.price.toFixed(2)}
                  </Typography>
                )}
              </Stack>
              {coupon && (
                <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                  Promotion Code: {coupon.promotionCodes[0]?.code || "N/A"}
                </Typography>
              )}

              {/* Size Selector */}
              {isSizeBased && availableSizes?.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1">Select Size:</Typography>
                  <Select
                    fullWidth
                    value={selectedSize || ""}
                    onChange={(e) => handleSizeSelection(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Choose a size
                    </MenuItem>
                    {availableSizes.map((size, index) => (
                      <MenuItem key={index} value={size.sizeType}>
                        {size.sizeType} (In Stock: {size.quantity})
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              )}

              {/* Quantity Selector */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1">Quantity:</Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mt: 1 }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    -
                  </Button>
                  <TextField
                    value={quantity}
                    slotProps={{
                      htmlInput: {
                        readOnly: true,
                        style: { textAlign: "center" },
                      },
                    }}
                    sx={{ width: 50 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => {
                      let inStock: number;
                      const sizeBased = product.sizeBasedQuantity.enabled;
                      const sizeBasedQuantity = product.sizeBasedQuantity;

                      if (sizeBased) {
                        const size = selectedSize;
                        if (!size) {
                          return alert("Please select size");
                        }

                        const selectedSizeDetails =
                          sizeBasedQuantity.details.find(
                            (detail) => detail.sizeType === size
                          );

                        inStock = selectedSizeDetails!.quantity!;
                      } else {
                        inStock = product.quantity!;
                      }

                      handleQuantityChange(1, inStock);
                    }}
                  >
                    +
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    {product.inStock &&
                      !product.sizeBasedQuantity.enabled &&
                      `${product.quantity} In Stock`}
                  </Typography>
                </Stack>
              </Box>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShoppingCart01 />}
                  disabled={
                    isSizeBased && !selectedSize ? true : !product.inStock
                  }
                  onClick={() => {
                    let inStock: number;
                    const sizeBased = product.sizeBasedQuantity.enabled;
                    const sizeBasedQuantity = product.sizeBasedQuantity;

                    if (sizeBased) {
                      const size = selectedSize;
                      if (!size) {
                        return alert("Please select size");
                      }

                      const selectedSizeDetails =
                        sizeBasedQuantity.details.find(
                          (detail) => detail.sizeType === size
                        );

                      inStock = selectedSizeDetails!.quantity!;
                    } else {
                      inStock = product.quantity!;
                    }

                    // Correctly invoke the appropriate function
                    if (isGuest) {
                      handleCartGuest(
                        product._id,
                        product.name,
                        product.price,
                        product.images,
                        product.sizeBasedQuantity,
                        product.sizeBasedQuantity.enabled,
                        inStock
                      );
                    } else {
                      handleCartLoggedIn(
                        product._id,
                        product.sizeBasedQuantity.enabled,
                        inStock
                      );
                    }
                  }}
                >
                  Add to Cart
                </Button>
              </Stack>
            </Box>
          </Grid2>

          {/* <Grid2 size={{ xs: 12, md: 12 }}>

            <Divider sx={{ my: 4 }} />

       
            <Box>
              <Typography variant="h5" gutterBottom>
                Reviews
              </Typography>
              {reviews.map((review, index) => (
                <Box key={index} sx={{ my: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {review.username}
                  </Typography>
                  <Rating value={review.rating} readOnly precision={0.5} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {review.comment}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                </Box>
              ))}
            </Box>
          </Grid2> */}
          
        </Grid2>
      </Box>

      <Box
        sx={{
          position: "fixed",
          right: 20,
          top: { xs: 120, sm: 140, md: 140 },
          zIndex: 1000,
          backgroundColor: "primary.main",
          borderRadius: "50%",
          boxShadow: 3,
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
      >
        <IconButton
          color="inherit"
          onClick={() => router.push(`/demo/barber/shop/${branch}/cart`)}
          size="large"
        >
          <Badge badgeContent={cartItemCount} color="error" overlap="circular">
            <ShoppingCart01 fontSize="large" />
          </Badge>
        </IconButton>
      </Box>
    </Container>
  );
}

export default ProductPage;
