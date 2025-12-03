"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
// import { useRouter } from "next/router";

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
}



export const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const isActive = (pathname === "/" && href === "/") || (pathname === href || pathname?.startsWith(`${href}/`));

    const onClick = () => {
        router.push(href);
    }

    return (
        <button
            onClick={onClick}
            type="button"
            className={
                cn(
                    "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-gray-600 hover:bg-grey-300/20",
                    isActive && "text-grey-700 bg-grey-200 hover:bg-grey-200 hover:text-grey-700"
                )
            }
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                    size={22}
                    className={
                        cn(
                            "text-slate-500", isActive && "text-grey-700"
                        )
                    }
                />
                {label}
            </div>
            <div
            className={cn(
                "ml-auto opacity-0 border-2 border-gray-700 h-full transition-all", isActive && "opacity-100"
            )}
            />
        </button>
    );
}