import { Menu, MenuCategory } from "@/components/menu";
import { ClipboardType, Sparkles } from "lucide-react";

const menuCategories: MenuCategory[] = [
  {
    icon: <ClipboardType className="size-6" />,
    title: "Lang editor",
    description: "Editer vos fichiers de langue Dofus Retro",
    link: "/lang-editor",
    beta: true,
  },
  {
    icon: <Sparkles className="size-6" />,
    title: "Spell creator",
    description: "Créer vos sorts Dofus Retro",
    link: "/spell-creator",
    available: false,
  },
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
    <div className="flex justify-center bg-zinc-50 dark:bg-black">
      <Menu title="Retro Toolbox" categories={menuCategories} />
    </div>
  );
}
