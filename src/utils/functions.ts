import { useMediaQuery } from "@mui/material";

export const useRenderMobileOrDesktop = () => {

  const isWindowPhone = useMediaQuery(`(max-width:950px)`);

  return { isWindowPhone, loading: false };
};
