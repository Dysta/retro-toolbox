import { Menu, MenuCategory } from "@/components/menu";
import { ClipboardType } from "lucide-react";

const menuCategories: MenuCategory[] = [
  {
    icon: <ClipboardType className="size-6" />,
    title: "Lang editor",
    description: "Editer vos fichiers de langue Dofus Retro",
    link: "/lang-editor",
    beta: true,
  },
  // {
  // 	icon: <Sparkles className="size-6" />,
  // 	title: "Spell editor",
  // 	description: "Créer vos sorts Dofus Retro",
  // 	link: "#spells",
  // 	available: false,
  // },
  // {
  // 	icon: <Axe className="size-6" />,
  // 	title: "Items editor",
  // 	description: "Editer vos items Dofus Retro",
  // 	link: "#items",
  // 	available: false,
  // },
];

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <Menu title="Retro Toolbox" categories={menuCategories} />
    </div>
  );
}
