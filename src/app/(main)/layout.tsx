import ScrollableTabslistExample, {
    ScrollableTabsItem,
} from "@/components/scrollable-tabslist-basic";

const Navbar: ScrollableTabsItem[] = [
  { value: "Accueil", link: "/" },
  { value: "Lang Editor", link: "/lang-editor" },
  // { value: "Spell Editor", link: "/spell-editor" },
  // { value: "Items Editor", link: "/items-editor" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ScrollableTabslistExample tabs={Navbar} />
      {children}
    </>
  );
}
