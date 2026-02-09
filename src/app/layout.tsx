import ScrollableTabslistExample, {
  ScrollableTabsItem,
} from "@/components/scrollable-tabslist-basic";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./style.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Retro Toolbox",
  description:
    "A collection of tools for developers, designers, and makers around Dofus retro.",
};

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ScrollableTabslistExample tabs={Navbar} />
        {children}
      </body>
    </html>
  );
}
