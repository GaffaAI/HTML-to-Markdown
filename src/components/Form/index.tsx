"use client";
import { FC, useEffect, useState } from "react";
import {
  Input,
  Globe,
  Popover,
  Tooltip,
  Button,
  Code,
  LoaderCircle,
  ArrowLeftRight,
  toast,
} from "@gaffaai/uikit";

import { ResultsBlock } from "../ResultsBlock";
import { InfoMessage } from "../InfoMessage";
import { clsx } from "clsx";
import { urlPattern } from "../../constants";
import { DetailsDrawer } from "../DetailsDrawer";
import RequestJson from "./request.json";
import type { MarkdownRequest } from "../../types";
import { useFetchMarkdown } from "../../hooks/useFetchMarkdown";
import { useFetchUserCount } from "../../hooks/useFetchUserCount";
import { Turnstile } from "../Turnstile";

export interface FormProps {}

const PROXY_LOCATIONS = [
  { label: "United States", value: "us" },
  { label: "Ireland", value: "ie" },
  { label: "Singapore", value: "sg" },
  { label: "France", value: "fr" },
];
const { toast: toastInstance } = toast;
export const Form: FC<FormProps> = () => {
  const [url, setUrl] = useState("");
  const [userRequestCount, setUserRequestCount] = useState(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [location, setLocation] = useState(PROXY_LOCATIONS[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState("");
  const [requestPayload, setRequestPayload] =
    useState<MarkdownRequest>(RequestJson);

  const {
    status,
    data,
    error: fetchError,
    markdownData,
    fetchMarkdown,
  } = useFetchMarkdown(setUserRequestCount);
  const {
    status: countStatus,
    error: countError,
    fetchUserCount,
  } = useFetchUserCount(setUserRequestCount);

  useEffect(() => {
    if (url) setError("");
  }, [url]);

  useEffect(() => {
    fetchUserCount();
  }, []);

  useEffect(() => {
    setRequestPayload({
      ...RequestJson,
      url,
      proxy_location: location.value,
    } as any);
  }, [url, location]);

  const handleSubmit = () => {
    if (!url) {
      return setError("URL is required");
    }
    if (!urlPattern.test(url)) {
      return setError("Please enter a valid URL");
    }
    setError("");
    setIsFormSubmitted(true);
  };

  useEffect(() => {
    if (fetchError || countError) {
      const message = fetchError || countError || "Something went wrong";
      toastInstance.error(message);
    }
  }, [fetchError, countError]);

  const onCloudflareSuccess = async (token: string) => {
    try {
      const response = await fetch("/api/token-validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ turnstileToken: token }),
      });
      const data = await response.json();
      if (data.success) {
        fetchMarkdown(requestPayload);
      } else {
        toastInstance.error("Turnstile validation failed. Please try again.");
      }
      setIsFormSubmitted(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toastInstance.error(
          error.message || "Turnstile validation failed. Please try again.",
        );
      } else {
        toastInstance.error("Turnstile validation failed. Please try again.");
      }
      setIsFormSubmitted(false);
    }
  };

  const getInfoMessageVariant = () => {
    if (userRequestCount > 0) {
      return userRequestCount >= 10 ? "info" : "warning";
    }
    return "danger";
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="rounded-2xl shadow-lg px-4 py-6 flex flex-col">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 xl:justify-between">
              <p className="text-base font-medium ml-2 text-black-400">
                Website URL
              </p>
              <InfoMessage
                variant={getInfoMessageVariant()}
                message={`${userRequestCount} conversion credits remaining`}
              />
            </div>
            <Input
              value={url}
              error={error}
              placeholder="https://example.com"
              startIcon={<Globe strokeWidth={1.5} />}
              onChange={(event) => setUrl(event.target.value)}
            />
            <div className="flex items-center gap-2">
              <div className="text-base font-medium ml-2 text-black-400 flex gap-1">
                <p>Location: </p>
                <Popover
                  content={PROXY_LOCATIONS.map((loc) => (
                    <div
                      key={loc.value}
                      onClick={() => setLocation(loc)}
                      className={clsx(
                        "cursor-pointer hover:bg-accent-100 px-3 py-3",
                        loc.value === location.value &&
                          "bg-accent-200 w-full h-full",
                      )}
                    >
                      <span className={"font-medium text-black-400"}>
                        {loc.label}
                      </span>
                    </div>
                  ))}
                >
                  <div>
                    <Tooltip
                      side="bottom"
                      className="max-w-52 z-10"
                      content={
                        "Your request will go through this location so we can show the page for that region"
                      }
                    >
                      <p className="text-accent-300 cursor-pointer">
                        {location.label}
                      </p>
                    </Tooltip>
                  </div>
                </Popover>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-6 md:grid md:grid-cols-[193px_1fr] md:ml-auto">
            <Button
              className="w-full max-h-10"
              variant="secondaryOutline"
              size="l"
              endIcon={<Code strokeWidth={1.5} />}
              onClick={() => setIsDrawerOpen(true)}
            >
              View code
            </Button>

            {isFormSubmitted ? (
              <Turnstile onSuccess={onCloudflareSuccess} />
            ) : (
              <Button
                size="l"
                className="w-full max-h-10 md:max-w-193px"
                variant="secondary"
                isDisabled={
                  status === "loading" ||
                  countStatus === "loading" ||
                  userRequestCount <= 0
                }
                endIcon={
                  status === "loading" ? (
                    <LoaderCircle className="animate-spin" strokeWidth={1} />
                  ) : (
                    <ArrowLeftRight strokeWidth={1.5} />
                  )
                }
                onClick={handleSubmit}
              >
                {status === "loading" ? "Converting..." : "Convert"}
              </Button>
            )}
          </div>
        </div>
        {markdownData && <ResultsBlock markdownData={markdownData} />}
      </div>
      <DetailsDrawer
        isLoading={status === "loading"}
        isOpen={isDrawerOpen}
        requestPayload={requestPayload}
        responsePayload={data}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};
