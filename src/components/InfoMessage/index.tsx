import { FC } from "react";
import { Info } from "@gaffaai/uikit";
export interface InfoMessageProps {
  message: string;
  variant?: "info" | "warning" | "danger";
}
export const InfoMessage: FC<InfoMessageProps> = ({
  message,
  variant = "info",
}) => {
  const color =
    variant === "info"
      ? "text-accent-300"
      : variant === "warning"
        ? "text-orange"
        : "text-red";

  return (
    <div className={`${color} flex items-center gap-2`}>
      <Info className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};
