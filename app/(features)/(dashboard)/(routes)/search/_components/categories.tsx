"use client"

import { category } from "@prisma/client";
import { FcContacts, FcEngineering, FcFilmReel, FcMultipleDevices, FcOldTimeCamera, FcSalesPerformance, FcSportsMode } from 'react-icons/fc';
import { IconType } from "react-icons";
import { CategoryItem } from "./category-item";

interface CategoriesProps {
    items: category[];
}

const iconMap: Record<category["name"], IconType> = {
    "Javascript": FcContacts,
    "Photography": FcOldTimeCamera,
    "Manual Testing": FcSportsMode,
    "Typescript": FcSalesPerformance,
    "Computer Science": FcMultipleDevices,
    "DevOps": FcFilmReel,
    "Automation Testing": FcEngineering
}

export const Categories = ({ items, }: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    )
}