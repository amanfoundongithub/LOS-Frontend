import { useMediaQuery, useTheme } from "@mui/material";

export const useIsDeviceMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("md"));
};