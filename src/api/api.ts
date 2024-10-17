import CryptoJS from "crypto-js";

import { IRequest } from "../utils/interfaces/request.interface";
import { getCookie } from "../utils/utils";

export interface FetcherOptions<T = unknown> {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: T;
}

export interface IResponse<T> {
  isOk: boolean;
  message: string;
  data: T | undefined;
}

function generateSign<T = unknown>(method: FetcherOptions["method"], url: string, body: T, userSecret: string | null) {
  const bodyStr = JSON.stringify(body);

  const stringToSign = bodyStr ? `${method}${url}${bodyStr}${userSecret}` : `${method}${url}${userSecret}`;

  const sign = CryptoJS.MD5(stringToSign).toString(CryptoJS.enc.Hex);

  return sign;
}

export const requestStatus: IRequest = {
  isError: false,
  isSuccess: false,
  isFetching: false,
};

export async function apiFetcher<T, V = unknown>(url: string, options: FetcherOptions<V> = {}): Promise<IResponse<T>> {
  const { method = "GET", headers = {}, body } = options;
  const key = getCookie("bookScribe_at");
  const secret = getCookie("bookScribe_secret");

  const sign = generateSign<T>(method, url, body as T, secret);

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  if (key) {
    config.headers = {
      ...config.headers,
      key,
      sign,
    };
  }

  const response = await fetch(process.env.REACT_APP_API_HOST + url, config);

  return (await response.json()) as IResponse<T>;
}
