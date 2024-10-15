import "./App.css";

import { ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "../components/protected-route";
import { AuthContextProvider } from "../context/auth.context";
import { UserContextProvider } from "../context/user.context";
import { RegisterPage } from "../pages/register-page/register-page";
import { theme } from "../utils/configs/mui.config";

const App = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <UserContextProvider>
          <AuthContextProvider>
            <Routes>
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<>HOMEPAGE</>} />
              </Route>
            </Routes>
          </AuthContextProvider>
        </UserContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
