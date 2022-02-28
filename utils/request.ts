import fetch from "cross-fetch";

const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_SERVER;

export const get = async (url: string, params?: any, options?: any) => {
  try {
    const response = await fetch(getUrlWithParams(url, params), toJsonFetchOptions("GET", undefined, options));
    return handleResponse(response);
  } catch (e) {
    handleError(e);
  }
};

export const post = async (url: string, params: any, options?: any) => {
  try {
    const response = await fetch(ensureApiHostname(url), toJsonFetchOptions("POST", params, options));
    return handleResponse(response);
  } catch (e) {
    handleError(e);
  }
};

export const put = async (url: string, params: any, options?: any) => {
  try {
    const response = await fetch(ensureApiHostname(url), toJsonFetchOptions("PUT", params, options));
    return handleResponse(response);
  } catch (e) {
    handleError(e);
  }
};

export const remove = async (url: string, params?: any, options?: any) => {
  try {
    const response = await fetch(ensureApiHostname(url), toJsonFetchOptions("DELETE", params, options));
    return handleResponse(response);
  } catch (e) {
    handleError(e);
  }
};

function ensureApiHostname(url: string) {
  return url.startsWith("/") ? `${DEFAULT_API_URL}${url}` : url;
}

function toJsonFetchOptions(method: string, params?: Record<string, any>, options?: any) {
  return {
    method,
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    ...(options || {}),
    body: params ? JSON.stringify(params || {}) : undefined,
  };
}

function handleError(e: unknown) {
  if (e instanceof Error) {
    throw new Error(e.message);
  } else {
    console.error("Unknown error", e);
    throw new Error("Unknown error");
  }
}

async function handleResponse(response: Response) {
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return;
  }

  const data = await response.json();
  return data;
}

export function getUrlWithParams(url: string, params?: any) {
  const urlO = new URL(ensureApiHostname(url));
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          urlO.searchParams.append(key, v as string);
        });
      } else {
        urlO.searchParams.append(key, value as string);
      }
    });
  }
  return urlO.toString();
}
