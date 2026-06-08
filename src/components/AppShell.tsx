import { useState, type ReactNode } from "react";
import { Box } from "@mui/material";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { useLayout } from "../context/LayoutContext";

const HEADER_HEIGHT = 56;
const SIDEBAR_COLLAPSED_WIDTH = 70;

interface AppShellProps {
  children: ReactNode;
  userInitials?: string;
  defaultActiveNav?: string;
}

export default function AppShell({
  children,
  userInitials = "JD",
  defaultActiveNav = "shipment",
}: AppShellProps) {
  const [activeNav, setActiveNav] = useState(defaultActiveNav);
  const { isFullscreen } = useLayout();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {!isFullscreen && <AppHeader userInitials={userInitials} />}
      {!isFullscreen && <AppSidebar activeKey={activeNav} onNavigate={setActiveNav} />}
      <Box
        component="main"
        sx={{
          pt: isFullscreen ? 0 : `${HEADER_HEIGHT}px`,
          pl: isFullscreen ? 0 : `${SIDEBAR_COLLAPSED_WIDTH}px`,
          minHeight: "100vh",
          boxSizing: "border-box",
          transition: "padding 0.2s ease",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
