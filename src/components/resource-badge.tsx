import { Badge } from "@hubble-ds/components/ui/badge";
import type { ComponentProps } from "react";
import type { ResourceBadgeVariant } from "@/lib/resource/types";

/**
 * O Badge do Hubble só tem primary, secondary, destructive, outline e ghost. Para status de
 * sucesso e alerta usamos o `secondary` com os tokens de badge que o próprio DS publica
 * (`badge-bg-success`, `badge-text-success`, `badge-bg-warning`, `badge-text-warning`).
 */
const statusTokens: Partial<Record<ResourceBadgeVariant, string>> = {
  success: "bg-badge-bg-success text-badge-text-success **:text-badge-text-success",
  warning: "bg-badge-bg-warning text-badge-text-warning **:text-badge-text-warning",
};

function ResourceBadge({
  variant = "secondary",
  ...props
}: Readonly<
  Omit<ComponentProps<typeof Badge>, "variant"> & { variant?: ResourceBadgeVariant }
>) {
  const tokens = statusTokens[variant];
  return tokens ? (
    <Badge variant="secondary" className={tokens} {...props} />
  ) : (
    <Badge variant={variant as Exclude<ResourceBadgeVariant, "success" | "warning">} {...props} />
  );
}

export { ResourceBadge };
