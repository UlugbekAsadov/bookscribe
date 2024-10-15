import CryptoJS from "crypto-js";

import { IRequest } from "../utils/interfaces/request.interface";
import { getCookie } from "../utils/utils";

export interface FetcherOptions<T = any> {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: T;
}

interface IResponse<T> {
  isOk: boolean;
  message: string;
  data: T;
}

function generateSign<T = any>(method: FetcherOptions["method"], url: string, body: T, userSecret: string | null) {
  const bodyStr = JSON.stringify(body);

  const stringToSign = bodyStr ? `${method}${url}${bodyStr}${userSecret}` : `${method}${url}${userSecret}`;

  const sign = CryptoJS.MD5(stringToSign).toString(CryptoJS.enc.Hex);

  return sign;
}

export const requestStatus: IRequest = {
  errorMessage: "",
  isError: false,
  isSuccess: false,
  successMessage: "",
  isFetching: false,
};

export async function apiFetcher<T>(url: string, options: FetcherOptions<T> = {}): Promise<IResponse<T>> {
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
