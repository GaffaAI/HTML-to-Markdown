"use client";
import { BlogCard } from "@gaffaai/uikit";
import { Form } from "../components/Form";
import { SiteInfoCard } from "../components/SiteInfoCard";
import { toast } from "@gaffaai/uikit";

const { Toaster } = toast;
export default function Home() {
  return (
    <div className="md:min-h-[calc(100vh-80px)] gap-10 flex flex-col xl:grid  xl:grid-cols-[420px_1fr]   pb-16 xl:pb-0 pt-20 xl:gap-12 xxl:grid-cols-[480px_1fr] 2xl:grid-cols-[536px_1fr] mx-auto max-w-[1700px]">
      <SiteInfoCard />
      <div className="flex flex-col gap-16 xl:flex-1 h-full xl:justify-between ">
        <Form />
        <BlogCard
          image="./images/Link.png"
          title={"Convert Any Webpage to LLM-Ready Markdown Using Gaffa"}
          description="How you can use Gaffa to convert any web page into markdown, ready to feed into your LLM-based apps"
          link={{
            href: "https://gaffa.dev/blog/convert-any-web-page-to-llm-ready-markdown-using-gaffa",
            label: "Read Full Guide",
          }}
        />
      </div>
      <Toaster />
    </div>
  );
}
