import { useRef } from "react";
import useSWR, { SWRResponse } from "swr";
import { get, getUrlWithParams } from "../utils/request";

const fetcher = (url: string) => get(url)

export function useLazyQuery(url: string, params?: any): [(params?: any) => Promise<void>, SWRResponse] {
  const result = useRef(null)
  const queryUrl = getUrlWithParams(url, params)
  const swr = useSWR(queryUrl, () => Promise.resolve(result.current));

  const query = async (params?: any) => {
    const isCustomURL = typeof params === "string"
    const url = isCustomURL ? params : queryUrl
    const updatedUrl = getUrlWithParams(url, isCustomURL ? {} : params)
    result.current = await fetcher(updatedUrl);
    swr.mutate(result.current, false);
  };

  return [query, swr]
}

export default function useQuery(url: string, params?: any) {
  const swr = useSWR(
    getUrlWithParams(url, params),
    fetcher
  );

  return swr
}
