import { useCallback, useEffect, useState } from "react";

import { IResponse } from "../api/api";
import { IRequest } from "../utils/interfaces/request.interface";

export const initialRequestStatus: IRequest = {
  isError: false,
  isSuccess: false,
  isFetching: false,
};

interface IQueryParams<T> {
  queryFn: () => Promise<IResponse<T>>;
  onSuccess?: (data?: T) => void;
  onError?: (error?: unknown) => void;
  enabled?: boolean;
}

interface IQueryResponse<T> {
  data: T | undefined;
  isError: IRequest["isError"];
  isSuccess: IRequest["isSuccess"];
  isFetching: IRequest["isFetching"];
  refetch: () => void;
}

export const useQuery = <T = unknown>({ queryFn, onSuccess, onError, enabled = true }: IQueryParams<T>): IQueryResponse<T> => {
  const [requestStatus, setRequestStatus] = useState<IRequest>(initialRequestStatus);
  const [data, setData] = useState<T | undefined>(undefined);

  const fetchData = useCallback(async () => {
    setRequestStatus({ isError: false, isSuccess: false, isFetching: true });

    try {
      const res = await queryFn();

      if (res.isOk) {
        setData(res.data);
        setRequestStatus({ isError: false, isSuccess: true, isFetching: false });
        onSuccess?.(res.data);
      } else {
        setRequestStatus({ isError: true, isSuccess: false, isFetching: false });
        onError?.(res);
      }
    } catch (error) {
      setRequestStatus({ isError: true, isSuccess: false, isFetching: false });
      onError?.(error);
    }
  }, [queryFn, onSuccess, onError]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled]);

  return { ...requestStatus, data, refetch: fetchData };
};
