import "./App.css";

import { ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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
            </Routes>
          </AuthContextProvider>
        </UserContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
