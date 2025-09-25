import { useState } from "react";

import { MarkdownJob, MarkdownRequest, UserCount } from "@/types";

export const useFetchMarkdown = (setCount: (count: number) => void) => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [data, setData] = useState<MarkdownJob | null>(null);
  const [markdownData, setMarkdownData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkdown = async (payload: MarkdownRequest) => {
    setStatus("loading");
    try {
      const response = await fetch("/api/markdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result: { user: UserCount; gaffaResponse: { data: MarkdownJob } } =
        await response.json();

      setCount(result.user.count);
      setData(result.gaffaResponse.data);
      const actions = result.gaffaResponse.data.actions;
      const markdownAction = actions.find(
        (action) => action.type === "generate_markdown" && action.output,
      );
      const markdownUrl = markdownAction?.output || null;
      setMarkdownData(markdownUrl);
      setStatus("success");
    } catch (error) {
      console.error("Error fetching markdown:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
      setStatus("error");
    }
  };

  return { markdownData, status, data, error, fetchMarkdown };
};
