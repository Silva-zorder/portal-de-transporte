import { cn } from "cn";
import type { ComponentProps, ReactNode } from "react";

function PageHeader({
  title,
  badge,
  actions,
  className,
  children,
  ...props
}: Readonly<
  Omit<ComponentProps<"header">, "title"> & {
    title: ReactNode;
    badge?: ReactNode;
    actions?: ReactNode;
  }
>) {
  return (
    <header
      className={cn(
        "flex flex-col gap-xs border-b border-border-100 bg-background px-md py-xs",
        className,
      )}
      data-testid="page-header"
      {...props}
    >
      <div className="flex min-h-9 items-center gap-xs">
        <h1 className="typo-heading-4 text-text">{title}</h1>
        {badge}
        <div className="ml-auto flex items-center gap-xs">{actions}</div>
      </div>
      {children}
    </header>
  );
}

export { PageHeader };
