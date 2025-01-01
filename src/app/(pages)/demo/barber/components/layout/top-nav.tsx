"use client";

import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  MenuItem,
  Avatar,
  Menu,
  ListItemIcon,
  SvgIcon,
  Chip,
  useTheme,
  Collapse,
  Stack,
} from "@mui/material";
import MenuIcon from "@/icons/untitled-ui/duocolor/menu";
import { RouterLink } from "@/components/router-link";
import LogOut01 from "@/icons/untitled-ui/duocolor/log-out-01";
import HomeSmile from "@/icons/untitled-ui/duocolor/home-smile";
import NotificationBar from "@/components/notification-bar";
import { useClientData } from "@/app/authentication/frontend/auth-context";
import { ToastContainer, Bounce } from "react-toastify";
import ExpandMore from "@/icons/untitled-ui/duocolor/expand-more";
import ExpandLess from "@/icons/untitled-ui/duocolor/expand-less";
import Close from "@/icons/untitled-ui/duocolor/close";
import Locations from "@/icons/untitled-ui/duocolor/location";
import { CustomerBranches } from "../../layout";
import EmptyState from "@/components/empty-state";
import { API_BASE_URL } from "@/paths";

const navItems = [
  { label: "About", href: "/demo/barber/about" },
  { label: "Blog", href: "/demo/barber/blog" },
  { label: "Services", href: "/demo/barber/services" },
  { label: "Shop", href: "/demo/barber/shop", button: true },
  { label: "Book Now", href: "/demo/barber/booking", button: true },
];

const notifications = [
  "Welcome to our website!",
  "Check out our latest promotion code. Shop or book now",
  "Earn point you can convert to discount code anytime you spend",
];

const BarberTopNav = ({ branches }: { branches: CustomerBranches[] }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorElAvatar, setAnchorElAvatar] = useState<null | HTMLElement>(
    null
  );
  const [anchorElShop, setAnchorElShop] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleMenuOpenAvatar = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElAvatar(event.currentTarget);
  const handleMenuCloseAvatar = () => setAnchorElAvatar(null);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const [shopOpen, setShopOpen] = useState(false);
  const handleShopToggle = () => setShopOpen(!shopOpen);

  const { isGuest, customerData } = useClientData();

  return (
    <Box>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme.palette.mode}
        transition={Bounce}
      />
      <AppBar
        elevation={0}
        position="fixed"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <NotificationBar notifications={notifications} displayDuration={4000} />
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h5"
              component="a"
              href="/demo/barber"
              sx={{ flexGrow: 1, textDecoration: "none", fontWeight: "bold" }}
            >
              BarberDemo
            </Typography>

            {/* Nav items for larger screens */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {navItems.map((item, index) => {
                if (item.label === "Shop") {
                  return (
                    <Box key={index}>
                      <Button
                        color="primary"
                        onClick={(event) =>
                          setAnchorElShop(event.currentTarget)
                        }
                        sx={{ textTransform: "none", fontWeight: "bold" }}
                      >
                        Shop
                      </Button>
                      <Menu
                        anchorEl={anchorElShop}
                        open={Boolean(anchorElShop)}
                        onClose={() => setAnchorElShop(null)}
                        sx={{
                          mt: 1,
                          "& .MuiMenu-paper": {
                            boxShadow: theme.shadows[3],
                            borderRadius: 2,
                          },
                        }}
                      >
                        {branches.length > 0 ? (
                          branches.map((branch) => (
                            <MenuItem
                              key={branch.id}
                              onClick={() => setAnchorElShop(null)}
                              component={RouterLink}
                              href={`/demo/barber/shop/${branch.id}`}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                px: 2,
                                py: 1.5,
                                "&:hover": {
                                  backgroundColor: theme.palette.action.hover,
                                },
                              }}
                            >
                              <SvgIcon color="primary" sx={{ fontSize: 20 }}>
                                <Locations />
                              </SvgIcon>
                              <Typography
                                variant="body1"
                                sx={{
                                  flexGrow: 1,
                                  fontWeight: 500,
                                }}
                              >
                                {branch.name}
                              </Typography>
                              <Chip
                                label={`${branch.productCount} products`}
                                size="small"
                                color="primary"
                                sx={{
                                  fontWeight: "bold",
                                  backgroundColor: theme.palette.primary.light,
                                  color: theme.palette.primary.dark,
                                }}
                              />
                            </MenuItem>
                          ))
                        ) : (
                          <EmptyState message="We are still setting up. Please try again later" />
                        )}
                      </Menu>
                    </Box>
                  );
                } else {
                  return (
                    <Button
                      key={index}
                      href={item.href}
                      variant={item.button ? "contained" : "text"}
                      color={"primary"}
                      sx={{
                        textTransform: "none",
                        fontWeight: item.button ? "bold" : "normal",
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                }
              })}

              {isGuest ? (
                <Button size="small" href="/demo/login">
                  Login
                </Button>
              ) : (
                <>
                  <IconButton onClick={handleMenuOpenAvatar} sx={{ p: 0 }}>
                    <Avatar
                      src={
                        `${API_BASE_URL}/users/${customerData?._id}/avatar` ||
                        "/assets/avatars/avatar-anika-visser.png"
                      }
                      alt={customerData?.name ? customerData.name : ""}
                    />
                  </IconButton>
                  <Menu
                    anchorEl={anchorElAvatar}
                    open={Boolean(anchorElAvatar)}
                    onClose={handleMenuCloseAvatar}
                    slotProps={{ paper: { sx: { width: 250 } } }}
                  >
                    {/* Avatar menu items */}
                    <ListItem
                      component={RouterLink}
                      href={"/demo/barber/dashboard/profile"}
                    >
                      <ListItemIcon>
                        <SvgIcon color="primary">
                          <HomeSmile />
                        </SvgIcon>
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography>Dashboard</Typography>}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem component={RouterLink} href={"/logout"}>
                      <ListItemIcon>
                        <SvgIcon color="error">
                          <LogOut01 />
                        </SvgIcon>
                      </ListItemIcon>
                      <ListItemText primary={<Typography>Logout</Typography>} />
                    </ListItem>
                  </Menu>
                </>
              )}
            </Box>

            {/* Menu icon for smaller screens */}
            <IconButton
              edge="start"
              color="primary"
              aria-label="menu"
              sx={{ display: { md: "none" } }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
        <Stack
          sx={{ mt: 2, mr: 2 }}
          direction={"row"}
          justifyContent={"flex-end"}
        >
          <Box
            sx={{
              borderRadius: 2,
              border: 2,
              borderColor: "error.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              bgcolor: "background.paper",
            }}
          >
            <IconButton size="large" onClick={handleDrawerToggle}>
              <Close />
            </IconButton>
          </Box>
        </Stack>
        <Box
          sx={{
            width: "100vw",
            role: "presentation",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            bgcolor: "background.paper",
          }}
        >
          <List>
            {navItems.map((item, index) => {
              if (item.label === "Shop") {
                return (
                  <Box key={index}>
                    <ListItem
                      component={"button"}
                      onClick={handleShopToggle}
                      sx={{ px: 2 }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 500 }}
                          >
                            Shop
                          </Typography>
                        }
                      />
                      {shopOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={shopOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {branches.length > 0 ? (
                          branches.map((branch) => (
                            <ListItem
                              key={branch.id}
                              component="a"
                              href={`/demo/barber/shop/${branch.id}`}
                              sx={{
                                "&:hover": { bgcolor: "action.hover" },
                              }}
                            >
                              <SvgIcon color="primary" sx={{ fontSize: 20 }}>
                                <Locations />
                              </SvgIcon>
                              <Typography
                                variant="body2"
                                sx={{ flexGrow: 1, fontWeight: 500, ml: 1 }}
                              >
                                {branch.name}
                              </Typography>
                              <Chip
                                label={`${branch.productCount} products`}
                                size="small"
                                color="primary"
                                sx={{
                                  fontWeight: "bold",
                                  backgroundColor: "primary.light",
                                  color: "primary.dark",
                                }}
                              />
                            </ListItem>
                          ))
                        ) : (
                          <EmptyState message="We are still setting up. Please try again later" />
                        )}
                      </List>
                    </Collapse>
                  </Box>
                );
              } else {
                return (
                  <ListItem
                    key={index}
                    component="a"
                    href={item.href}
                    sx={{
                      px: 2,
                      py: 1,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 500 }}
                        >
                          {item.label}
                        </Typography>
                      }
                    />
                  </ListItem>
                );
              }
            })}
          </List>

          {/* Guest/Logged-In User Options */}
          <Divider sx={{ my: 2 }} />
          {isGuest ? (
            <Button
              fullWidth
              href="/demo/login"
              variant="contained"
              color="primary"
              sx={{ py: 1, textTransform: "none", fontWeight: "bold" }}
            >
              Login
            </Button>
          ) : (
            <>
              <List>
                <ListItem
                  component="a"
                  href="/demo/barber/dashboard/profile"
                  sx={{ px: 2, py: 1, "&:hover": { bgcolor: "action.hover" } }}
                >
                  <ListItemIcon>
                    <SvgIcon color="primary">
                      <HomeSmile />
                    </SvgIcon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Dashboard
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem
                  component="a"
                  href="/logout"
                  sx={{ px: 2, py: 1, "&:hover": { bgcolor: "action.hover" } }}
                >
                  <ListItemIcon>
                    <SvgIcon color="error">
                      <LogOut01 />
                    </SvgIcon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Logout
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default BarberTopNav;
