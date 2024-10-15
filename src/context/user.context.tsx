import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiFetcher, requestStatus } from "../api/api";
import { IRequest } from "../utils/interfaces/request.interface";
import { IUser } from "../utils/interfaces/user.interface";

interface IUserContext {
  user: IUser | null;
  fetchCurrentUser: () => Promise<void>;
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
  const [user, setUser] = useState<IUser | null>(null);
  const [userFetchingRequest, setUserFetchingRequest] = useState<IRequest>(requestStatus);
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    setUserFetchingRequest({ ...requestStatus, isFetching: true });

    const res = await apiFetcher<IUser>("/myself");

    if (res.isOk) {
      setUserFetchingRequest((prevVal) => ({ ...prevVal, isFetching: false, isSuccess: true, successMessage: res.message }));
      setUser(res.data);
    } else {
      navigate("/register");
      setUserFetchingRequest((prevVal) => ({ ...prevVal, isFetching: false, isError: true, errorMessage: res.message }));
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const value = useMemo(() => ({ user, fetchCurrentUser }), [user]);

  if (userFetchingRequest.isFetching) {
    return null;
  }
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
