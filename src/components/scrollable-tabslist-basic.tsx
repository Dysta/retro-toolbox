"use client";

import { ScrollableTabsList } from "@/components/shadcnblocks/scrollable-tabslist";
import { ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

export interface ScrollableTabsItem {
  value: string;
  link: string;
}

interface ScrollableTabsProps {
  tabs?: ScrollableTabsItem[];
}

const ScrollableTabslistExample = ({ tabs = [] }: ScrollableTabsProps) => {
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
      <ScrollableTabsList>
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
      </ScrollableTabsList>
    </Tabs>
  );
};

export default ScrollableTabslistExample;
