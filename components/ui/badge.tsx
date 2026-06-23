import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "info";

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-brand-muted text-brand-muted-foreground border-brand-muted/60",
  secondary:
    "bg-secondary text-secondary-foreground border-secondary",
  success:
    "bg-brand-muted text-brand-muted-foreground border-brand-muted/60 dark:bg-brand-muted dark:text-brand-muted-foreground dark:border-brand-muted/40",
  warning:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  destructive:
    "bg-destructive-subtle text-destructive border-destructive/20 dark:bg-destructive-subtle dark:text-destructive dark:border-destructive/30",
  info:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
};

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
