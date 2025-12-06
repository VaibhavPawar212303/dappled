"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
    icon: LucideIcon
    label: string;
    href: string;
}

export const SidebarItem = ({ icon: Icon, label: Label, href: Href }: SidebarItemProps) => {
    const pathname = usePathname();
    const router = useRouter()
    const isActive = (pathname == "/" && pathname == Href || pathname?.startsWith(`${Href}/`));
    const onClick = () => {
        router.push(Href);
    }

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                isActive && "text-black bg-gray-100 hover:bg-gray-100 hover:text-black",
            )}>
            <div className="flex items-center gap-x-4 py-4">
                <Icon size={22} className={
                    cn("text-black", isActive && "text-black mr-2")
                } />
                {Label}
            </div>
            <div className={
                cn("ml-auto opacity-0 border-2 border-black h-full transition-all", isActive && "opacity-100")
            } />
        </button>
    )
}