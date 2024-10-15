import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiFetcher } from "../api/api";
import { IUser } from "../utils/interfaces/user.interface";

interface IUserContext {}

const UserContext = createContext<IUserContext | null>(null);

export const useUserContext = (): IUserContext => {
  const ctx = useContext(UserContext);

  if (!ctx) throw new Error(`useUserContext must be used within UserContextProvider`);

  return ctx;
};

interface IProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: IProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isUserFetching, setIsUserFetching] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    const user = await apiFetcher<IUser>("/myself");

    const hasUser = user.isOk;

    if (!hasUser) navigate("/register");
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if (isUserFetching) {
    return null;
  }

  const value = useMemo(() => ({ user }), [user]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
