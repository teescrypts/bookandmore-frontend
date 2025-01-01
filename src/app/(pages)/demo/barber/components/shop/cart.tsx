"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Add from "@/icons/untitled-ui/duocolor/add";
import Delete from "@/icons/untitled-ui/duocolor/delete";
import Remove from "@/icons/untitled-ui/duocolor/remove";
import { CartItem } from "../../shop/[branch]/cart/page";
import { API_BASE_URL } from "@/paths";
import { ValidCouponType } from "@/app/actions/action-types";
import { useClientData } from "@/app/authentication/frontend/auth-context";
import EmptyState from "@/components/empty-state";
import { useRouter } from "next/navigation";
import {
  comfirmStockQty,
  confirmStockB4Checkout,
  deleteCartItem,
  fetchValidCoupons,
  mergeCart,
  updateQuantity,
} from "@/app/actions/actions";
import { CartItemType } from "./shop-page";
import ModalBox from "@/components/modal";
import Link from "next/link";

const calculateDiscountedPrice = (
  productId: string,
  originalPrice: number,
  validCoupons: ValidCouponType[]
): { discountedPrice: number; promotionCode?: string } => {
  const coupon = validCoupons.find((coupon) =>
    coupon.addedProducts.some((p) => p._id === productId)
  );
  if (!coupon) return { discountedPrice: originalPrice };

  const discountValue =
    coupon.valueType === "percent_off"
      ? (coupon.value / 100) * originalPrice
      : coupon.value;

  return {
    discountedPrice: Math.max(0, originalPrice - discountValue),
    promotionCode: coupon.promotionCodes[0]?.code,
  };
};

interface CartPageProps {
  branch: string;
  cartItems: CartItem[];
  validCoupons: ValidCouponType[];
}

export interface localStorageExtCart {
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
    sizeBasedQuantity: { enabled: boolean; size: string };
    value: number;
  };
  branch: string;
}

const CartPage: React.FC<CartPageProps> = ({
  branch,
  cartItems,
  validCoupons,
}) => {
  // const [message, setMessage] = useState("");
  const [currentCartItems, setCurrentCartItem] = useState<CartItem[]>();
  const [totals, setTotals] = useState<{ subtotal: number; total: number }>();
  const [currentValidCoupon, setCurrentValidCoupon] =
    useState<ValidCouponType[]>();
  const { isGuest } = useClientData();
  const router = useRouter();

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
  }, [isGuest]);

  const calculateTotals = useCallback(() => {
    if (currentCartItems && currentValidCoupon) {
      const totals = currentCartItems.reduce(
        (totals, item) => {
          const { discountedPrice } = calculateDiscountedPrice(
            item.product._id,
            item.product.price,
            currentValidCoupon
          );
          const itemSubtotal = item.product.price * item.quantity.value;

          totals.subtotal += itemSubtotal;
          totals.total += discountedPrice * item.quantity.value;
          return totals;
        },
        { subtotal: 0, total: 0 }
      );

      setTotals(totals);
    }
  }, [currentCartItems, currentValidCoupon, cartItems, validCoupons]);

  const fetchGuestValidCoupon = useCallback(async () => {
    const result = await fetchValidCoupons(branch);
    if (result?.error) throw new Error(result.error);
    if (result?.success) {
      setCurrentValidCoupon(result.success);
    }
  }, [isGuest, validCoupons]);

  useEffect(() => {
    if (currentValidCoupon) {
      calculateTotals();
    }
  }, [currentCartItems, currentValidCoupon, cartItems, validCoupons]);

  useEffect(() => {
    if (isGuest) {
      fetchGuestValidCoupon();
      const existingCart = localStorage.getItem("cart");

      if (existingCart) {
        const existingCartArr = JSON.parse(existingCart);
        const existingCartBranch = existingCartArr.filter(
          (item: CartItemType) => item.branch === branch
        );
        setCurrentCartItem(existingCartBranch);
      } else {
        setCurrentCartItem([]);
      }

      return;
    }

    setCurrentValidCoupon(validCoupons);
    setCurrentCartItem(cartItems);
  }, [isGuest, , cartItems, validCoupons]);

  // Helper to fetch cart from localStorage
  const getCartFromLocalStorage = (): CartItem[] => {
    const existingCart = localStorage.getItem("cart");
    return existingCart ? JSON.parse(existingCart) : [];
  };

  // Helper to save cart to localStorage and update state
  const saveCart = (updatedCart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const updatedCartBranch = updatedCart.filter(
      (item: CartItem) => item.branch === branch
    );
    setCurrentCartItem(updatedCartBranch);
  };

  // Handle updating the quantity of a cart item
  const handleUpdateQty = async (
    item: string,
    newQty: number,
    productId: string,
    size?: string
  ) => {
    const result = await comfirmStockQty(productId, newQty, size);

    if (result.error) {
      return alert(result.error);
    }

    if (isGuest) {
      const existingCart = getCartFromLocalStorage();

      // Map over the cart and update the quantity of the matching item
      const updatedCart = existingCart.map((cartItem) => {
        const extProductId = cartItem.product._id;
        const extSize = cartItem.quantity.sizeBasedQuantity.size;

        if (extProductId === productId && (!size || extSize === size)) {
          return {
            ...cartItem,
            quantity: { ...cartItem.quantity, value: newQty },
          };
        }
        return cartItem;
      });

      saveCart(updatedCart);
    } else {
      try {
        const result = await updateQuantity(item, newQty);
        if (result?.error)
          throw new Error(`Failed to update quantity: ${result.error}`);
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }
  };

  // Handle removing items from the cart
  const handleRemove = async (
    item: string,
    productId: string,
    size?: string
  ) => {
    if (isGuest) {
      const existingCart = getCartFromLocalStorage();

      // Filter the cart to exclude the matching item
      const updatedCart = existingCart.filter(({ product, quantity }) => {
        const extProductId = product._id;
        const extSize = quantity.sizeBasedQuantity.size;

        // Match productId and optional size
        return size
          ? !(extProductId === productId && extSize === size)
          : extProductId !== productId;
      });

      saveCart(updatedCart);
    } else {
      try {
        const result = await deleteCartItem(item);
        if (result?.error)
          throw new Error(`Failed to remove item: ${result.error}`);
      } catch (error) {
        console.error("Error removing item:", error);
      }
    }
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    if (currentCartItems) {
      const cartItemsRequest = currentCartItems.map((item) => {
        return {
          product: item.product._id,
          quantity: item.quantity.value,
          ...(item.quantity.sizeBasedQuantity.enabled && {
            size: item.quantity.sizeBasedQuantity.size,
          }),
        };
      });

      const result = await confirmStockB4Checkout(cartItemsRequest);

      if (result?.error) {
        if (result?.insufficientStockItems) {
          const errors = result.insufficientStockItems.map(
            (item) =>
              `Product "${item.productName}" has only ${item.available} available.`
          );
          setErrorMessages(errors);
          setLoading(false);
          return;
        } else {
          setErrorMessages([result.error || "An unknown error occurred."]);
          setLoading(false);
          return;
        }
      }
    }

    if (isGuest) {
      handleOpen();
      setLoading(false);
    } else {
      router.push(`/demo/barber/shop/${branch}/checkout`);
    }
  };

  if (currentCartItems && currentValidCoupon) {
    return (
      <Box sx={{ mt: 25 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Shopping Cart
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {currentCartItems.length === 0 && (
            <Stack direction={"row"} justifyContent={"center"}>
              <EmptyState
                message="Your cart is empty"
                actionLabel="Start Shopping"
                onActionClick={() => router.push(`/demo/barber/shop/${branch}`)}
              />
            </Stack>
          )}

          {currentCartItems.length > 0 &&
            currentCartItems.map((item, index) => {
              const { discountedPrice, promotionCode } =
                calculateDiscountedPrice(
                  item.product._id,
                  item.product.price,
                  currentValidCoupon
                );

              return (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Stack direction="row" spacing={2}>
                      {/* Product Image */}
                      <img
                        src={`${API_BASE_URL}/${item.product.images[0]?.url}`}
                        alt={item.product.name}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "contain",
                          border: "1px solid #ddd",
                          borderRadius: 8,
                        }}
                      />

                      {/* Product Details */}
                      <Box flex={1}>
                        <Typography variant="h6">
                          {item.product.name}
                        </Typography>
                        {item.quantity.sizeBasedQuantity.enabled && (
                          <Typography variant="body2" color="text.secondary">
                            Size: {item.quantity.sizeBasedQuantity.size}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {item.quantity.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Price: ${discountedPrice.toFixed(2)}{" "}
                          {discountedPrice < item.product.price && (
                            <span
                              style={{
                                textDecoration: "line-through",
                                color: "grey",
                              }}
                            >
                              (${item.product.price.toFixed(2)})
                            </span>
                          )}
                        </Typography>
                        {promotionCode && (
                          <Typography variant="body2" color="success.main">
                            Promotion Code: {promotionCode}
                          </Typography>
                        )}
                      </Box>

                      {/* Quantity Controls */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton
                          onClick={() =>
                            handleUpdateQty(
                              item._id,
                              Math.max(1, item.quantity.value - 1),
                              item.product._id,
                              item.quantity.sizeBasedQuantity?.size
                            )
                          }
                        >
                          <Remove />
                        </IconButton>
                        <Typography>{item.quantity.value}</Typography>
                        <IconButton
                          onClick={() =>
                            handleUpdateQty(
                              item._id,
                              item.quantity.value + 1,
                              item.product._id,
                              item.quantity.sizeBasedQuantity?.size
                            )
                          }
                        >
                          <Add />
                        </IconButton>
                      </Stack>

                      {/* Remove Button */}
                      <IconButton
                        onClick={() =>
                          handleRemove(
                            item._id,
                            item.product._id,
                            item.quantity.sizeBasedQuantity?.size
                          )
                        }
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}

          {/* Display Error Messages */}
          {errorMessages.length > 0 && (
            <Stack spacing={2} sx={{ mt: 3 }}>
              {errorMessages.map((error, index) => (
                <Alert key={index} severity="error">
                  {error}
                </Alert>
              ))}
            </Stack>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Totals Section */}
          {totals && currentCartItems.length > 0 && (
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="body1" gutterBottom>
                Subtotal (before discounts): ${totals.subtotal.toFixed(2)}
              </Typography>
              <Typography variant="h6" color="primary">
                Total (after discounts): ${totals.total.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Taxes and shipping will be calculated at checkout.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
                disabled={loading}
                onClick={handleCheckout}
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
              </Button>
            </Box>
          )}
        </Container>
        <ModalBox open={open} onClose={handleClose}>
          <Stack spacing={2}>
            <EmptyState
              message="You are not logged in. Please log in to proceed with checkout."
              actionLabel="Log in"
              onActionClick={() => router.push("/demo/login")}
            />

            <Typography variant="subtitle2" textAlign={"center"}>
              Don't have an account? <Link href={"/demo/signup"}>Sign up</Link>{" "}
            </Typography>
          </Stack>
        </ModalBox>
      </Box>
    );
  } else {
    return (
      <Box sx={{ mt: 25 }}>
        <Container maxWidth="lg">
          <Stack justifyContent={"center"} direction={"row"}>
            <CircularProgress />
          </Stack>
        </Container>
      </Box>
    );
  }
};

export default CartPage;
