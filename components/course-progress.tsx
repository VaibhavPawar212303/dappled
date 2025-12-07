import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
    value: number;
    variant?: "default" | "success";
    size?: "default" | "sm";
}

// const colorByVariant = {
//     default: "text-sky-700",
//     success: "text-emerald-700"
// }

// const sizeByVariant = {
//     default: "text-sm",
//     sm: "text-emerald-700"
// }

export const CourseProgress = ({ value }: CourseProgressProps) => {
    return (
        <div>
            <Progress
                className="h-2"
                value={value}
            />
            <p className={cn(
                "mt-2 font-medium text-black"
            )}>
                {Math.round(value)}% Complete
            </p>
        </div>
    )
}