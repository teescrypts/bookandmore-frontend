"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  InputAdornment,
  Avatar,
  Divider,
  MenuItem,
  Grid2,
  CardHeader,
  Autocomplete,
  Box,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  CircularProgress,
} from "@mui/material";
import Add from "@/icons/untitled-ui/duocolor/add";
import Delete from "@/icons/untitled-ui/duocolor/delete";
import Search from "@/icons/untitled-ui/duocolor/search";
import Remove from "@/icons/untitled-ui/duocolor/remove";
import { CustomerPos, ProductPos } from "../../pos/page";
import { API_BASE_URL } from "@/paths";
import ShoppingCart01 from "@/icons/untitled-ui/duocolor/shopping-cart-01";
import {
  calculateTaxForPos,
  createSale,
  searchPosProduct,
} from "@/app/actions/actions";
import EmptyState from "@/components/empty-state";
import notify from "@/utils/toast";

interface CartItem {
  productId: string;
  name: string;
  size?: string;
  quantity: number;
  price: number;
  url: string;
  stripeProductId: string;
}

export default function ModernPointOfSale({
  products,
  customers,
}: {
  products: ProductPos[];
  customers: CustomerPos[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "mobile payment"
  >("cash");
  const [selectedCustomer, setSelectedCustomer] = useState<{
    _id: string;
    fname: string;
    lname: string;
    email: string;
  } | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductPos | null>(
    null
  );
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [totals, setTotals] =
    useState<{ amount: number; amount_tax: number }[]>();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentProducts, setCurrentProducts] = useState<ProductPos[]>();

  const searchProducts = useCallback(
    async (query: string) => {
      if (query) {
        const result = await searchPosProduct(query);

        if (result?.error) setMessage(result.error);
        if (result?.success) setCurrentProducts(result.success);
      } else {
        setCurrentProducts(products);
      }
    },
    [products]
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchProducts(searchQuery);
    }, 300); // Adjust the debounce delay as needed

    return () => clearTimeout(delayDebounce); // Clear timeout on cleanup
  }, [searchQuery, searchProducts]);

  useEffect(() => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const total = subtotal + totalTax - discount;

    setTotal(Number(total.toFixed(2)));
    setSubtotal(Number(subtotal.toFixed(2)));
  }, [cart, totalTax, discount]);

  const HandleCreateSale = async () => {
    if (cart.length === 0) {
      return alert("Cart Is empty");
    }

    setLoading(true);

    const products = cart.map((cartItem) => {
      return {
        product: cartItem.productId,
        quantity: cartItem.quantity,
        ...(cartItem.size && { size: cartItem.size }),
        price: cartItem.price,
      };
    });

    const data = {
      ...(selectedCustomer && { customer: selectedCustomer._id }),
      products,
      totalAmount: total,
      totalDiscount: discount,
      totalTax,
      paymentMethod,
    };

    const result = await createSale(data);

    if (result?.error) {
      setMessage(result.error);
      setLoading(false);
    }
    if (result?.success) {
      setSelectedCustomer(null);
      setDiscount(0);
      setTotal(0);
      setSubtotal(0);
      setTotalTax(0);
      setTotals(undefined);
      setSelectedProduct(null);
      notify(result.success);
      setCart([]);
      setLoading(false);
    }
  };

  const calculateTax = useCallback(async () => {
    if (cart.length === 0) {
      return alert("The cart is mpty");
    }

    setLoading(true);

    const data = cart.map((cartItem) => {
      return {
        amount: cartItem.price,
        stripeProductId: cartItem.stripeProductId,
        name: cartItem.name,
        quantity: cartItem.quantity,
      };
    });

    const result = await calculateTaxForPos(data);

    if (result?.error) {
      setMessage(result.error);
      setLoading(false);
    }

    if (result?.success) {
      const amountData = result.success;

      if (typeof amountData === "string") {
        setMessage(amountData);
        setLoading(false);
      } else {
        const taxTotal = amountData
          .map((itemAmount) => itemAmount.amount_tax * itemAmount.quantity)
          .reduce((a, b) => a + b);

        setTotalTax(taxTotal / 100);
        setTotals(amountData);
        setLoading(false);
      }
    }
  }, [cart]);

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter((item) => item.productId !== id));
    setTotals(undefined);
    setTotalTax(0);
  };

  const handleUpdateQuantity = (
    id: string,
    quantity: number,
    cartItemsize?: string
  ) => {
    const selectedProduct = products.find((product) => product._id === id);

    if (selectedProduct) {
      const stock = selectedProduct.sizeBasedQuantity.enabled
        ? selectedProduct.sizeBasedQuantity.details.find(
            (size) => size.sizeType === cartItemsize
          )?.quantity || 0
        : selectedProduct.quantity || 0;

      if (quantity > stock) {
        alert("Quantity exceeds available stock!");
        return;
      }

      setCart(
        cart.map((item) =>
          item.productId === id
            ? { ...item, quantity: Math.max(quantity, 1) }
            : item
        )
      );
      setTotals(undefined);
      setTotalTax(0);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    const stock = selectedProduct.sizeBasedQuantity.enabled
      ? selectedProduct.sizeBasedQuantity.details.find(
          (size) => size.sizeType === selectedSize
        )?.quantity || 0
      : selectedProduct.quantity || 0;

    if (selectedQuantity > stock) {
      alert("Quantity exceeds available stock!");
      return;
    }

    const newCartItem: CartItem = {
      productId: selectedProduct._id,
      name: selectedProduct.name,
      size: selectedProduct.sizeBasedQuantity.enabled
        ? selectedSize
        : undefined,
      quantity: selectedQuantity,
      price: selectedProduct.price,
      url: `${API_BASE_URL}/${selectedProduct.images[0].url}`,
      stripeProductId: selectedProduct.stripeData.productId,
    };

    setCart((prevCart) => [...prevCart, newCartItem]);
    setSelectedProduct(null);
    setSelectedSize("");
    setSelectedQuantity(1);
    setTotals(undefined);
    setTotalTax(0);
  };

  const handleOpenDialog = (product: ProductPos) => {
    setSelectedProduct(product);
  };

  return (
    <Grid2 container spacing={3}>
      {/* Product Section */}
      <Grid2 size={{ xs: 12, md: 8 }}>
        <Card>
          <CardHeader title="Products" />
          <CardContent>
            {/* Search Product */}
            <TextField
              fullWidth
              placeholder="Search for products"
              value={searchQuery}
              variant="outlined"
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 2 }}
            />

            {/* Product Grid */}
            <Box>
              <Grid2 container spacing={3}>
                {!currentProducts && (
                  <Stack direction={"row"} justifyContent={"center"}>
                    <CircularProgress />
                  </Stack>
                )}

                {currentProducts && currentProducts.length === 0 && (
                  <EmptyState message="No product found" />
                )}

                {currentProducts &&
                  currentProducts.length > 0 &&
                  currentProducts.map((product) => (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                      <Card>
                        <Box
                          sx={{
                            width: "100%",
                            height: 300, // Fixed height for consistent card sizes
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={`${API_BASE_URL}/${product.images[0]?.url}`}
                            alt={product.name}
                            sx={{
                              width: "100%",
                              height: "auto",
                            }}
                          />
                        </Box>
                        <CardContent>
                          <Typography variant="h6">{product.name}</Typography>
                          <Typography variant="body2">
                            ${product.price.toFixed(2)}
                          </Typography>
                          <Typography variant="body2">
                            {product.sizeBasedQuantity.enabled
                              ? `Available sizes: ${product.sizeBasedQuantity.details
                                  .map((size) => size.sizeType)
                                  .join(", ")}`
                              : `Stock: ${product.quantity || 0}`}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenDialog(product)}
                            sx={{ mt: 2 }}
                          >
                            Add to Cart
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid2>
                  ))}
              </Grid2>

              {/* Cart Section */}
              {/* <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<ShoppingCart01 />}
                >
                  Cart ({cart.length})
                </Button>
              </Box> */}

              {/* Product Dialog */}
              <Dialog
                open={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                fullWidth
                maxWidth="sm"
              >
                <DialogTitle>Add {selectedProduct?.name} to Cart</DialogTitle>
                <DialogContent>
                  <Stack spacing={2}>
                    {selectedProduct?.sizeBasedQuantity.enabled ? (
                      <>
                        <TextField
                          variant="outlined"
                          select
                          label="Size"
                          value={selectedSize}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          fullWidth
                        >
                          {selectedProduct.sizeBasedQuantity.details.map(
                            (size) => (
                              <MenuItem
                                key={size.sizeType}
                                value={size.sizeType}
                              >
                                {size.sizeType} (Stock: {size.quantity})
                              </MenuItem>
                            )
                          )}
                        </TextField>
                      </>
                    ) : (
                      <Typography>
                        Stock: {selectedProduct?.quantity || 0}
                      </Typography>
                    )}
                    <TextField
                      variant="outlined"
                      label="Quantity"
                      type="number"
                      value={selectedQuantity}
                      onChange={(e) =>
                        setSelectedQuantity(Number(e.target.value))
                      }
                      fullWidth
                    />
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setSelectedProduct(null)}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleAddToCart}>
                    Add to Cart
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </CardContent>
        </Card>
      </Grid2>

      {/* Cart Section */}
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Card>
          <CardHeader title="Cart" />
          <CardContent>
            {/* Customer Search */}
            <div>
              <Autocomplete
                options={customers}
                getOptionLabel={(option) =>
                  `${option.fname} ${option.lname} (${option.email})`
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search for customer"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                value={selectedCustomer}
                onChange={(event, newValue) => {
                  setSelectedCustomer(newValue || null);
                }}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                noOptionsText={
                  <List>
                    <ListItem
                      component="button"
                      onClick={() =>
                        setSelectedCustomer({
                          _id: "string",
                          fname: "string",
                          lname: "string",
                          email: "string",
                        })
                      }
                    >
                      <ListItemText primary={"Add Guest"} />
                    </ListItem>
                  </List>
                }
              />
              {selectedCustomer ? (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Customer:{" "}
                  {`${selectedCustomer.fname} ${selectedCustomer.lname}`} (
                  {selectedCustomer.email})
                </Typography>
              ) : (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  No customer selected.
                </Typography>
              )}
            </div>

            <Divider sx={{ mb: 2 }} />

            {/* Cart Items */}
            <List>
              {cart.map((item) => (
                <ListItem
                  key={item.productId}
                  secondaryAction={
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveFromCart(item.productId)}
                    >
                      <Delete />
                    </IconButton>
                  }
                >
                  <Avatar src={item.url} alt={item.name} sx={{ mr: 2 }} />
                  <ListItemText
                    primary={`${item.name} - $${item.price}`}
                    secondary={`Quantity: ${item.quantity}`}
                  />
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId,
                          item.quantity - 1,
                          item.size
                        )
                      }
                    >
                      <Remove />
                    </IconButton>
                    <Typography variant="h6">{item.quantity}</Typography>
                    <IconButton
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId,
                          item.quantity + 1,
                          item.size
                        )
                      }
                    >
                      <Add />
                    </IconButton>
                  </Stack>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ mt: 2, mb: 2 }} />

            {/* Summary */}
            <Typography variant="body1">Subtotal: ${subtotal}</Typography>
            <Typography variant="body1">
              Tax: {loading ? "Calculating..." : `$ ${totalTax}`}
            </Typography>
            <TextField
              fullWidth
              label="Discount"
              variant="outlined"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              type="number"
              sx={{ mt: 1 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
            />
            <Typography variant="h5" sx={{ mb: 2 }}>
              Total: ${total}
            </Typography>

            <TextField
              select
              label="Payment Method"
              variant="outlined"
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value as "cash" | "card" | "mobile payment"
                )
              }
              fullWidth
              sx={{ mt: 2 }}
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="mobile payment">Mobile Payment</MenuItem>
            </TextField>

            <Typography variant="subtitle2" color="error" sx={{ my: 2 }}>
              {message}
            </Typography>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2 }}
              onClick={() => {
                if (!totals) {
                  calculateTax();
                } else {
                  HandleCreateSale();
                }
              }}
            >
              {totals ? "Complete Transaction" : "Calculate Tax"}
            </Button>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
}
