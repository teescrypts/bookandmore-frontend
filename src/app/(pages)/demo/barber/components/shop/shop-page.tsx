"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
  Grid2,
  CircularProgress,
  Badge,
} from "@mui/material";
import {
  CustomerProductType,
  ValidCouponType,
} from "@/app/actions/action-types";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AddShoppingCart from "@/icons/untitled-ui/duocolor/add-shopping-cart";
import Search from "@/icons/untitled-ui/duocolor/search";
import { API_BASE_URL } from "@/paths";
import {
  addToCart,
  filterProducts,
  getCartItemCountLoggedInUser,
  mergeCart,
} from "@/app/actions/actions";
import { useClientData } from "@/app/authentication/frontend/auth-context";
import notify from "@/utils/toast";
import { useRouter } from "next/navigation";
import ShoppingCart01 from "@/icons/untitled-ui/duocolor/shopping-cart-01";
import EmptyState from "@/components/empty-state";
import { localStorageExtCart } from "./cart";

interface ShopPageProps {
  branch: string;
  products: CustomerProductType[];
  validCoupon: ValidCouponType[];
  total: number;
  categories: string[];
}

export interface CartItemType {
  product: {
    _id: string;
    name: string;
    price: number;
    images: {
      url: string;
      fileName?: string;
      imageId: string;
    }[];
    sizeBasedQuantity: {
      enabled: boolean;
      details: { sizeType?: string; quantity?: number }[];
    };
  };
  quantity: {
    sizeBasedQuantity: {
      enabled: boolean;
      size?: string;
    };
    value: number;
  };
  branch: string;
}

const ShopPage: React.FC<ShopPageProps> = ({
  branch,
  products,
  validCoupon,
  total,
  categories,
}) => {
  const [currentProducts, setCurrentProduct] = useState(products);
  const [currentValidCoupon, setCurrentValidCoupon] = useState(validCoupon);
  const [currentTotal, setCurrentTotal] = useState(total);
  const [cartItemCount, setCartItemCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchItem, setSearchItem] = useState<string>("");
  const [categoryItem, setCategoryItem] = useState("");

  const totalPages = Math.ceil(currentTotal / itemsPerPage);

  const router = useRouter();

  const { isGuest } = useClientData();
  const mergeCartRef = useRef(false);

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
    console.log("running");
    const existingCarts = localStorage.getItem("cart");

    if (existingCarts && !isGuest && !mergeCartRef.current) {
      mergeCartRef.current = true;
      const existingCartArr: localStorageExtCart[] = JSON.parse(existingCarts);

      const existingCartArrBranch = existingCartArr.filter(
        (item: localStorageExtCart) => item.branch === branch
      );

      for (let i = 0; i < existingCartArrBranch.length; i++) {
        const product = existingCartArrBranch[i].product;
        const quantity = existingCartArrBranch[i].quantity;
        try {
          const result = await mergeCart(product._id, quantity, branch);
          if (result?.error) throw new Error(result.error);
        } catch (e) {
          throw new Error("Internal server error");
        }
      }

      localStorage.removeItem("cart");
    }
  }, [isGuest]);

  useEffect(() => {
    mergeCartItems();
    getCartItemCount();
  }, [isGuest]);

  const handlePageChange = (_: any, page: number) => {
    setCurrentPage(page);
  };

  const applicableCoupon = (productId: string): ValidCouponType | undefined => {
    return currentValidCoupon.find((coupon) =>
      coupon.addedProducts.some((p) => p._id === productId)
    );
  };

  const handleFilters = useCallback(
    async (action: string) => {
      if (searchItem || categoryItem) {
        setLoading(true);
        const result = await filterProducts({
          [action]: searchItem ? searchItem : categoryItem,
        });

        if (result?.error) {
          setMsg(result.error);
          setLoading(false);
        }

        if (result?.success) {
          const newProducts = result.success.products;
          const newCoupons = result.success.validCoupons;
          const newTotal = result.success.total;

          setCurrentProduct(newProducts);
          setCurrentValidCoupon(newCoupons);
          setCurrentTotal(newTotal);
          setLoading(false);
        }
      }
    },
    [searchItem, categoryItem]
  );

  useEffect(() => {
    if (categoryItem) handleFilters("category");
  }, [categoryItem]);

  useEffect(() => {
    if (!searchItem && !categoryItem) {
      setCurrentProduct(products);
      setCurrentValidCoupon(validCoupon);
      setCurrentTotal(total);
    }
  }, [searchItem, categoryItem]);

  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    {}
  );

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

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
    const selectedSize = sizeBased ? selectedSizes[productId] : undefined;

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

    const cartKey = `${productId}-${selectedSize || "none"}`;

    // Check if product is out of stock
    if (inStock === 0) {
      alert("Product is out of stock");
      return; // Exit early as no further processing is needed
    }

    if (cartMap.has(cartKey)) {
      // Retrieve existing item
      const existingItem = cartMap.get(cartKey)!;

      // Calculate the resulting quantity
      const newQuantity = existingItem.quantity.value + 1;

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
            ...(sizeBased && { size: selectedSize }),
          },
          value: 1, // Default value for new item
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
    console.log("running cart");
    const result = await addToCart(
      instock,
      branch,
      productId,
      sizeBased,
      selectedSizes[productId]
    );

    if (result?.error) alert(result.error);
    if (result.success) {
      getCartItemCount();
      notify(result.success);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 25 }}>
      <Grid2 container spacing={2} sx={{ my: 8 }}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={searchItem}
            onChange={(e) => {
              setCategoryItem("");
              setSearchItem(e.target.value);
            }}
            placeholder="Search products by name..."
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton onClick={() => handleFilters("name")}>
                    <Search />
                  </IconButton>
                ),
              },
            }}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Stack justifyContent="flex-end" direction="row" spacing={2}>
            <FormControl sx={{ minWidth: 150 }} variant="outlined" size="small">
              <InputLabel id="categoryId">Category</InputLabel>
              <Select
                labelId="categoryId"
                value={categoryItem}
                onChange={async (e) => {
                  setSearchItem("");
                  setCategoryItem(e.target.value);
                }}
                label="Category"
              >
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Grid2>
      </Grid2>

      <Typography color="error" textAlign={"center"} variant="subtitle2">
        {msg}
      </Typography>

      {loading && (
        <Stack direction={"row"} justifyContent={"center"}>
          {" "}
          <CircularProgress />
        </Stack>
      )}

      <Grid2 container spacing={4}>
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => {
            const coupon = applicableCoupon(product._id);
            return (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <Carousel
                    autoPlay
                    interval={3000}
                    infiniteLoop
                    showThumbs={false}
                    showStatus={false}
                    showIndicators={false}
                    swipeable
                    stopOnHover
                    dynamicHeight={false}
                  >
                    {product.images.map((img) => (
                      <CardMedia
                        key={img.imageId}
                        component="img"
                        height="450"
                        image={
                          `${API_BASE_URL}/${img?.url}` || "/placeholder.jpg"
                        }
                        alt={product.name}
                      />
                    ))}
                  </Carousel>

                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {product.category.name}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.inStock &&
                        !product.sizeBasedQuantity.enabled &&
                        `${product.quantity} In Stock`}
                    </Typography>
                    {coupon && (
                      <Typography
                        variant="body2"
                        color="success.main"
                        sx={{ mt: 1, fontStyle: "italic" }}
                      >
                        {coupon.valueType === "percent_off"
                          ? `${coupon.value}%`
                          : `${coupon.value} USD`}{" "}
                        Discount Available! Use Code:{" "}
                        {coupon.promotionCodes[0].code}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between" }}>
                    {product.sizeBasedQuantity.enabled && (
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel id={`size-id-${product._id}`}>
                          Size
                        </InputLabel>
                        <Select
                          labelId={`size-id-${product._id}`}
                          variant="outlined"
                          label="Size"
                          value={selectedSizes[product._id] || ""}
                          onChange={(e) =>
                            handleSizeChange(product._id, e.target.value)
                          }
                        >
                          {product.sizeBasedQuantity.details.map(
                            (detail, index) => (
                              <MenuItem key={index} value={detail.sizeType}>
                                {detail.sizeType} - {detail.quantity} In Stock
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                    )}
                    <Box>
                      <IconButton
                        onClick={() => {
                          let inStock: number;
                          const sizeBased = product.sizeBasedQuantity.enabled;
                          const sizeBasedQuantity = product.sizeBasedQuantity;

                          if (sizeBased) {
                            const size = selectedSizes[product._id];
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
                        color="primary"
                      >
                        <AddShoppingCart />
                      </IconButton>

                      <Button
                        onClick={() =>
                          router.push(
                            `/demo/barber/shop/${branch}/${product._id}`
                          )
                        }
                        size="small"
                      >
                        View Product
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Grid2>
            );
          })
        ) : (
          <EmptyState message="Sorry we are still setting up. Please try again later" />
        )}
      </Grid2>

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
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
            <Badge
              badgeContent={cartItemCount}
              color="error"
              overlap="circular"
            >
              <ShoppingCart01 fontSize="large" />
            </Badge>
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
};

export default ShopPage;
