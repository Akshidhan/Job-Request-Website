import type { ReactNode } from "react";

type BadgeVariant = "open" | "progress" | "closed" | "neutral";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
  open: "badge badge-open",
  progress: "badge badge-progress",
  closed: "badge badge-closed",
  neutral: "badge app-border-line bg-white/70 app-text-muted",
};

export default function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  return <span className={`${variantClasses[variant]} ${className}`.trim()}>{children}</span>;
}