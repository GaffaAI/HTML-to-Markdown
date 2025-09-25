import { FC, useState } from "react";
import { Drawer, Code, X, Tabs, CodeEditor, InfoCard } from "@gaffaai/uikit";
import { MarkdownJob, MarkdownRequest } from "@/types";

export interface DetailsDrawerProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  requestPayload?: MarkdownRequest;
  responsePayload: MarkdownJob | null;
}

const tabList = ["Request", "Response"];

export const DetailsDrawer: FC<DetailsDrawerProps> = ({
  isOpen,
  onClose,
  isLoading,
  requestPayload,
  responsePayload,
}) => {
  const [selectedTab, setSelectedTab] = useState(tabList[0]);
  return (
    <Drawer isOpen={isOpen} onClose={onClose} className="!max-w-[564px] w-full">
      <X
        strokeWidth={1}
        className="absolute top-4 right-4 cursor-pointer w-6 h-6 text-black"
        onClick={onClose}
      />
      <div className="p-11 h-full flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Code className="w-8 h-8 text-black" strokeWidth={1} />
            <h2 className="text-black font-code font-bold text-xl">
              API Implementation
            </h2>
          </div>
          <p className="text-black-400 text-sm">
            View the request payload and response data for the conversion
          </p>
        </div>
        <div className="mt-8">
          <Tabs
            tabList={tabList}
            onTabChange={(tab) => setSelectedTab(tab)}
            variant="secondary"
          />
        </div>
        <div className="flex-1 overflow-auto">
          {selectedTab === "Request" && (
            <CodeEditor value={JSON.stringify(requestPayload, null, 2)} copy />
          )}
          {selectedTab === "Response" &&
            (isLoading ? (
              <InfoCard
                title="Loading..."
                description="The conversion is in progress. Please wait."
                className="!min-w-full !w-full"
              />
            ) : responsePayload ? (
              <CodeEditor
                value={JSON.stringify(responsePayload, null, 2)}
                copy
              />
            ) : (
              <InfoCard
                title="No Response"
                description="No response data available."
                className="!min-w-full !w-full"
              />
            ))}
        </div>
      </div>
    </Drawer>
  );
};
