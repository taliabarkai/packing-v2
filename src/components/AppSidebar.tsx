import { useState } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const NAV_ITEMS = [
  { key: "home", label: "Home", Icon: HomeOutlinedIcon },
  { key: "orders", label: "Orders", Icon: ListAltOutlinedIcon },
  { key: "shipment", label: "Shipment", Icon: LocalShippingOutlinedIcon },
  { key: "catalog", label: "Catalog", Icon: MenuBookOutlinedIcon },
  { key: "cart-engine", label: "Cart Engine", Icon: ShoppingCartOutlinedIcon },
  { key: "category", label: "Category", Icon: CategoryOutlinedIcon },
  { key: "accounts", label: "Accounts", Icon: AccountCircleOutlinedIcon },
];

const COLLAPSED_WIDTH = 70;
const EXPANDED_WIDTH = 180;
const HEADER_HEIGHT = 56;
const ACTIVE_COLOR = "#2196f3";
const ACTIVE_BG = "rgba(33, 150, 243, 0.12)";

interface AppSidebarProps {
  activeKey?: string;
  onNavigate?: (key: string) => void;
}

export default function AppSidebar({
  activeKey = "shipment",
  onNavigate,
}: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(true);
  const width = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  return (
    <Box
      component="nav"
      sx={{
        position: "fixed",
        top: HEADER_HEIGHT,
        left: 0,
        bottom: 0,
        width,
        bgcolor: "#2b2b2b",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        zIndex: 1200,
        transition: "width 0.2s ease",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Nav items */}
      <Stack
        component="ul"
        sx={{ listStyle: "none", m: 0, p: 0, pt: 1, flex: 1 }}
      >
        {NAV_ITEMS.map(({ key, label, Icon }) => {
          const isActive = key === activeKey;
          return (
            <Box
              key={key}
                component="li"
                onClick={() => onNavigate?.(key)}
                sx={{
                  display: "flex",
                  flexDirection: collapsed ? "column" : "row",
                  alignItems: "center",
                  justifyContent: collapsed ? "center" : "flex-start",
                  gap: collapsed ? 0 : 1.5,
                  px: collapsed ? 0 : 2,
                  py: collapsed ? 1 : 1.25,
                  cursor: "pointer",
                  borderRadius: 1,
                  mx: 0.5,
                  bgcolor: isActive ? ACTIVE_BG : "transparent",
                  color: isActive ? ACTIVE_COLOR : "rgba(255,255,255,0.6)",
                  "&:hover": {
                    bgcolor: isActive ? ACTIVE_BG : "rgba(255,255,255,0.06)",
                    color: isActive ? ACTIVE_COLOR : "rgba(255,255,255,0.9)",
                  },
                  transition: "background-color 0.15s, color 0.15s",
                  minHeight: 56,
                }}
              >
                <Icon
                  sx={{
                    fontSize: 24,
                    color: isActive ? ACTIVE_COLOR : "inherit",
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: collapsed ? 10 : 13,
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? ACTIVE_COLOR : "inherit",
                    lineHeight: 1.2,
                    mt: collapsed ? 0.4 : 0,
                    whiteSpace: "nowrap",
                    transition: "font-size 0.2s",
                    userSelect: "none",
                  }}
                >
                  {collapsed ? label : label}
                </Typography>
            </Box>
          );
        })}
      </Stack>

      {/* Collapse toggle */}
      <Box
        sx={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-end",
          p: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={() => setCollapsed((c) => !c)}
          sx={{
            color: "rgba(255,255,255,0.5)",
            "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
          }}
        >
          {collapsed ? (
            <ChevronRightIcon fontSize="small" />
          ) : (
            <ChevronLeftIcon fontSize="small" />
          )}
        </IconButton>
      </Box>
    </Box>
  );
}
