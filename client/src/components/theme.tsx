import React from "react";
import { ConfigProvider } from "antd";
import { useMediaQuery } from "react-responsive";

interface ThemeProviderProps {
  children?: any;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = (
  props: ThemeProviderProps
) => {
  const { children } = props;
  const isBigScreen = useMediaQuery({ query: "(min-width: 1200px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const theme = {
    token: {
      fontFamily: "Montserrat",
      fontWeightStrong: 700,
      fontSizeHeading1: isBigScreen ? 54 : 36,
    },
  };

  return (
    <ConfigProvider direction="ltr" theme={theme}>
      {children}
    </ConfigProvider>
  );
};
