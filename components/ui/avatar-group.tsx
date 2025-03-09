import * as React from "react";
import { cn } from "@/lib/utils";

const AvatarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    limit?: number;
  }
>(({ className, limit = 5, children, ...props }, ref) => {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = limit ? childrenArray.slice(0, limit) : childrenArray;
  const excess = limit ? Math.max(0, childrenArray.length - limit) : 0;

  return (
    <div ref={ref} className={cn("flex -space-x-2", className)} {...props}>
      {visibleChildren}
      {excess > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground ring-2 ring-background text-xs font-medium">
          +{excess}
        </div>
      )}
    </div>
  );
});

AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup };
