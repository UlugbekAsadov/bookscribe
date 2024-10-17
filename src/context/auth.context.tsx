import Cookies from "js-cookie";
import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { apiFetcher } from "../api/api";
import { useMutation } from "../hooks/useMutation";
import { IRegisterForm } from "../utils/interfaces/auth.interface";
import { IUser } from "../utils/interfaces/user.interface";
import { removeCookie } from "../utils/utils";
import { useUserContext } from "./user.context";

interface IAuthContext {
  signOut: () => void;
  registerUser: (registerForm: IRegisterForm) => Promise<void>;
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
  const { refetch } = useUserContext();
  const registerUserMutation = useMutation<IUser, IRegisterForm, string>({
    mutationFn: (registerForm: IRegisterForm) => apiFetcher<IUser, IRegisterForm>("/signup", { body: registerForm, method: "POST" }),
    onSuccess: (res) => {
      Cookies.set("bookScribe_at", res.key, { expires: 14, secure: true });
      Cookies.set("bookScribe_secret", res.secret, { expires: 14, secure: true });
      refetch();
      navigate("/");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const registerUser = async (registerForm: IRegisterForm) => {
    await registerUserMutation.mutateAsync(registerForm);
  };

  const navigate = useNavigate();

  const signOut = useCallback(() => {
    removeCookie("bookScribe_at");
    removeCookie("bookScribe_secret");
    navigate("/register");
  }, []);

  const value = useMemo(() => ({ signOut, registerUser }), []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
