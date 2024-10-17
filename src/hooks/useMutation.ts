import { useCallback, useState } from "react";

import { IResponse } from "../api/api";
import { IRequest } from "../utils/interfaces/request.interface";

export const initialRequestStatus: IRequest = {
  isError: false,
  isSuccess: false,
  isFetching: false,
};

interface IMutationParams<T, V, E> {
  mutationFn: (values: V) => Promise<IResponse<T>>;
  onSuccess?: (data: T) => void;
  onError?: (error: E) => void;
}

interface IMutationResponse<T, V> {
  mutateAsync: (values: V) => Promise<void>;
  data: T | undefined;
  isError: IRequest["isError"];
  isSuccess: IRequest["isSuccess"];
  isFetching: IRequest["isFetching"];
}

export const useMutation = <T = unknown, V = unknown, E = unknown>({
  mutationFn,
  onSuccess,
  onError,
}: IMutationParams<T, V, E>): IMutationResponse<T, V> => {
  const [requestStatus, setRequestStatus] = useState<IRequest>(initialRequestStatus);
  const [data, setData] = useState<T | undefined>(undefined);

  const mutateAsync = useCallback(
    async (values: V) => {
      setRequestStatus({ isError: false, isSuccess: false, isFetching: true });

      try {
        const res = await mutationFn(values);

        if (res.isOk && res.data) {
          setData(res.data);
          setRequestStatus({ isError: false, isSuccess: true, isFetching: false });
          onSuccess?.(res.data);
        } else {
          setRequestStatus({ isError: true, isSuccess: false, isFetching: false });
          onError?.(res as E);
        }
      } catch (error) {
        setRequestStatus({ isError: true, isSuccess: false, isFetching: false });
        onError?.(error as E);
      }
    },
    [mutationFn, onSuccess, onError],
  );

  return { ...requestStatus, data, mutateAsync };
};
