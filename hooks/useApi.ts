import { useState } from "react";

interface ErrorType {
  detail: string;
}

interface ApiResponse<T> {
  ok: boolean;
  data?: T | ErrorType;
  status: number;
}

export default function useApi<T>(
  apiFunc: (...args: any[]) => Promise<ApiResponse<T>>
) {
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const request = async (...args: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunc(...args);

      if (!response.ok) {
        if (response.status === 401) {
          console.log("Logout");
        } else if (isErrorType(response.data)) {
          setError(response.data.detail);
        } else {
          setError("An unexpected error occurred.");
        }
      } else {
        setData(response.data as T);
      }

      return response;
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return { data, error, setError, loading, request };
}

function isErrorType(data: any): data is ErrorType {
  return (data as ErrorType).detail !== undefined;
}
