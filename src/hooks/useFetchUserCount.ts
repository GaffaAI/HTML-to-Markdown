import { useState } from "react";

export const useFetchUserCount = (setCount: (count: number) => void) => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchUserCount = async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/markdown");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result: { count: number } = await response.json();
      setCount(result.count);
      setStatus("success");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      setStatus("error");
    }
  };

  return { status, error, fetchUserCount };
};
