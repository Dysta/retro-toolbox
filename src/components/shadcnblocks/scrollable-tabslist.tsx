import type { ReactNode } from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ScrollableTabsListProps {
  children: ReactNode;
}

const ScrollableTabsList = ({ children }: ScrollableTabsListProps) => {
  return (
    <div className="overflow-hidden rounded-full">
      <ScrollArea className="whitespace-nowrap">
        {children}
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
};

export { ScrollableTabsList };
