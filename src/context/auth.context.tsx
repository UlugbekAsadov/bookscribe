import { Alert, Snackbar } from "@mui/material";
import Cookies from "js-cookie";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiFetcher, requestStatus } from "../api/api";
import { IRegisterForm } from "../utils/interfaces/auth.interface";
import { IRequest } from "../utils/interfaces/request.interface";

interface IAuthContext {
  registerUser: (values: IRegisterForm) => Promise<void>;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const useAuthContext = (): IAuthContext => {
  const ctx = useContext(AuthContext);

  if (!ctx) throw new Error("useAuthContext must be used within AuthContextProvider");

  return ctx;
};

interface IProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: IProps) => {
  const [registerRequest, setRegisterRequest] = useState<IRequest>(requestStatus);

  const navigate = useNavigate();

  const registerUser = useCallback(async (registerForm: IRegisterForm) => {
    setRegisterRequest({ ...requestStatus, isFetching: true });

    const res = await apiFetcher<IRegisterForm>("/signup", { body: registerForm, method: "POST" });

    if (res.isOk) {
      Cookies.set("bookScribe_at", res.data.key, { expires: 14, secure: true });
      Cookies.set("bookScribe_secret", res.data.secret, { expires: 14, secure: true });
      navigate("/");
      setRegisterRequest((prevVal) => ({ ...prevVal, isFetching: false, isSuccess: true, successMessage: "Signed up. Redirecting..." }));
    } else {
      setRegisterRequest((prevVal) => ({ ...prevVal, isFetching: false, isError: true, errorMessage: res.message }));
    }
  }, []);

  const value = useMemo(() => ({ registerUser }), []);

  return (
    <AuthContext.Provider value={value}>
      {children}
      <Snackbar
        open={registerRequest.isError}
        autoHideDuration={2000}
        onClose={setRegisterRequest.bind(null, requestStatus)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={setRegisterRequest.bind(null, requestStatus)} severity="error">
          {registerRequest.errorMessage}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
};
