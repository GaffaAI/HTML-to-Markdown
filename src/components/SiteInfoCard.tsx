"use client";
import { SideCard, PoweredByGaffa, useBreakpoints } from "@gaffaai/uikit";
import { Logo } from "./icons/Logo";

const gaffaUrl = process.env.NEXT_PUBLIC_GAFFA_URL || "https://gaffa.ai";
const gaffaBlogUrl = `${gaffaUrl}/blog`;
const gitHubUrl =
  process.env.NEXT_PUBLIC_GITHUB_URL ||
  "https://github.com/GaffaAI/ArxivScraper";
export const SiteInfoCard = () => {
  const { isUpXL } = useBreakpoints();
  return (
    <div className="justify-between flex-col flex  xl:flex-1  xl:h-full ">
      <SideCard
        icon={<Logo className="" />}
        title="HTML to Markdown"
        className="max-h-fit "
        primaryLink={{ href: gaffaBlogUrl, label: "View Blog" }}
        secondaryLink={{ href: gitHubUrl, label: "View on GitHub" }}
        description="Convert Any Webpage to Clean Markdown.
Transform websites into LLM-ready markdown instantly. Perfect for AI processing, documentation, and content analysis."
      />
      {isUpXL && (
        <PoweredByGaffa className="ml-4 w-fit flex-col !items-start" />
      )}
    </div>
  );
};
