import { ReactNode } from "react";

import { AlertCircle, Info, SearchX } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

type PageStateProps = {
  title: string;
  description?: string;
  className?: string;
  action?: ReactNode;
};

export function PageLoading({ className }: { className?: string }) {
  return (
    <div className={cn("min-h-[30vh] flex items-center justify-center", className)}>
      <div className="h-8 w-8 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
    </div>
  );
}

export function PageError({
  title,
  description,
  className,
  action,
}: PageStateProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface-elevated p-6", className)}>
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <AlertCircle className="h-4 w-4 text-destructive" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold">{title}</h3>
          {description ? <p className="text-sm text-muted-foreground mt-1">{description}</p> : null}
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}

export function PageEmpty({
  title,
  description,
  className,
  action,
}: PageStateProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface-elevated p-6 text-center", className)}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <SearchX className="h-5 w-5 text-primary" />
        </div>
        <div className="max-w-md">
          <h3 className="font-semibold">{title}</h3>
          {description ? <p className="text-sm text-muted-foreground mt-1">{description}</p> : null}
        </div>
        {action ? action : null}
      </div>
    </div>
  );
}

export function PageInfo({
  title,
  description,
  className,
  action,
}: PageStateProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface-elevated p-6", className)}>
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-secondary/60 border border-secondary flex items-center justify-center">
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold">{title}</h3>
          {description ? <p className="text-sm text-muted-foreground mt-1">{description}</p> : null}
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}

export function PageActionLinkButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button onClick={onClick} variant="hero" className="rounded-xl">
      {children}
    </Button>
  );
}

