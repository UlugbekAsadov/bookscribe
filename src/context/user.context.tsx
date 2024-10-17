import { createContext, ReactNode, useContext, useMemo } from "react";

import { apiFetcher } from "../api/api";
import { useQuery } from "../hooks/useQuery";
import { IUser } from "../utils/interfaces/user.interface";

interface IUserContext {
  user?: IUser;
  refetch: () => void;
}

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
  const {
    data: user,
    isFetching,
    refetch,
  } = useQuery({
    queryFn: () => apiFetcher<IUser>("/myself"),
  });

  const value = useMemo(() => ({ user, refetch }), [user]);

  if (isFetching) {
    return null;
  }
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
