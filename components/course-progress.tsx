import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";

interface CourseProgressProps {
  value: number;
  variant?: "success" | "default";
  size?: "sm" | "default";
}

const colorByVariant = {
  default: "text-sky-700",
  success: "text-emerald-700",
};
const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

const CourseProgress = ({
  value,
  variant = "default",
  size = "default",
}: CourseProgressProps) => {
  return (
    <div>
      <Progress className="h-2" value={value} variant={variant} />
      <p
        className={cn(
          "mt-2 font-medium text-sky-700",
          colorByVariant[variant],
          sizeByVariant[size],
        )}
      >
        {Math.round(value)}% Complete
      </p>
    </div>
  );
};

export default CourseProgress;
