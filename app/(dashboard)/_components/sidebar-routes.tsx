"use client"

import { BarChart, Book, BookAIcon, Compass, Layout, List } from "lucide-react"
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/"
    },
    {
        icon: Compass,
        label: "Browse Courses",
        href: "/search"
    },
    {
        icon: Book,
        label: "Course Book",
        href: "/books"
    },
]

const teacherRoutes = [
    {
        icon: BarChart,
        label: "Analytics",
        href: "/teacher/analytics"
    },
    {
        icon: List,
        label: "Courses",
        href: "/teacher/courses"
    },
    {
        icon: BookAIcon,
        label: "Books",
        href: "/teacher/books"
    },
]

export const SidebarRoutes = () => {
    const pathname = usePathname();
    const isTeacher = pathname?.includes('/teacher');
    const routes = isTeacher ? teacherRoutes : guestRoutes;


    return (
        <div className="flex flex-col w-full">
            {routes.map((route) =>
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            )}
        </div>
    )
}