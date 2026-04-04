"use client";


import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export interface ScrollableTabsItem {
  value: string;
  link: string;
}

interface ScrollableTabsProps {
  tabs?: ScrollableTabsItem[];
}

const ScrollableTabslist = ({ tabs = [] }: ScrollableTabsProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const currentTab =
    tabs.find((tab) => pathname === tab.link)?.value ?? tabs[0]?.value;

  return (
    <Tabs
      value={currentTab}
      className="flex items-center justify-center grid-cols-1 gap-8 rounded-4xl lg:grid-cols-2 lg:p-8 xl:gap-20"
      onValueChange={(value) => {
        const tab = tabs.find((t) => t.value === value);
        if (tab) router.push(tab.link);
      }}
    >
      <div className="overflow-hidden rounded-full">
        <ScrollArea className="whitespace-nowrap">
          <TabsList className="mx-auto h-12 rounded-4xl p-2 lg:mx-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="h-full rounded-4xl px-4 py-2 cursor-pointer"
              >
                {tab.value}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
      </div>
    </Tabs>
  );
};

export default ScrollableTabslist;
