import { FC } from "react";
import { CodeEditor, Button, Copy, FileDown, toast } from "@gaffaai/uikit";

export interface ResultsBlockProps {
  markdownData: string;
}
export const ResultsBlock: FC<ResultsBlockProps> = ({ markdownData }) => {
  const { toast: showToast } = toast;
  const handleDownload = () => {
    const blob = new Blob([markdownData], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast.success("Markdown file downloaded!");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownData);
    showToast.success("Markdown copied to clipboard!");
  };

  return (
    <div className="flex flex-col rounded-2xl border border-black-200 p-4">
      <div className="flex items-center justify-between ">
        <h3 className="font-bold text-xl font-code">Converted Markdown</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="primaryOutline"
            className="max-h-9"
            onClick={handleCopy}
            endIcon={<Copy className="w-4 h-4" />}
          >
            Copy
          </Button>
          <Button
            variant="primary"
            className="max-h-9"
            onClick={handleDownload}
            endIcon={<FileDown className="w-4 h-4" />}
          >
            Download
          </Button>
        </div>
      </div>
      <div className="min-h-[360px] h-full max-h-[360px] overflow-y-auto mt-4">
        <CodeEditor value={markdownData} />
      </div>
    </div>
  );
};
