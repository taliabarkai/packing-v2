import { Avatar, Box } from "@mui/material";
import tenenGroupLogo from "../assets/tenengroup.svg";

interface AppHeaderProps {
  userInitials?: string;
}

export default function AppHeader({ userInitials = "JD" }: AppHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        bgcolor: "#2b2b2b",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        zIndex: 1300,
        boxSizing: "border-box",
      }}
    >
      {/* Left: full logo SVG at 36px height */}
      <Box
        component="img"
        src={tenenGroupLogo}
        alt="Tenengroup"
        sx={{ height: 36, width: "auto", filter: "brightness(0) invert(1)" }}
      />

      {/* Right: user avatar */}
      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor: "#90a4ae",
          color: "#ffffff",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        {userInitials}
      </Avatar>
    </Box>
  );
}
