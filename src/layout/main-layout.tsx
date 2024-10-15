import DashboardIcon from "@mui/icons-material/Dashboard";
import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";
import type { Navigation, Router, Session } from "@toolpad/core";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { ReactNode, useMemo, useState } from "react";

import { useAuthContext } from "../context/auth.context";
import { useUserContext } from "../context/user.context";

const NAVIGATION: Navigation = [
  {
    segment: "",
    title: "Books",
    icon: <DashboardIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

interface IProps {
  children: ReactNode;
}

export function MainLayout({ children }: IProps) {
  const [pathname, setPathname] = useState("/");
  const { user } = useUserContext();
  const { signOut } = useAuthContext();
  const [session] = useState<Session>({
    user: {
      email: user?.email,
      id: user?.id.toString(),
      image: "",
      name: user?.name,
    },
  });

  const authentication = useMemo(() => {
    return {
      signIn: () => null,
      signOut: signOut,
    };
  }, []);

  const router = useMemo<Router>(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return (
    <AppProvider
      session={session}
      branding={{ logo: <img src="/images/logo.png" alt="BookScribe" />, title: "BookScribe" }}
      authentication={authentication}
      navigation={NAVIGATION}
      theme={demoTheme}
      router={router}
    >
      <DashboardLayout>
        <Box
          sx={{
            p: 4,
          }}
        >
          {children}
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}
