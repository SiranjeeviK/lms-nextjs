import { IconBadge } from "@/components/icon-badge";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  numberOfItems: number;
  variant?: "default" | "success";
}

const InfoCard = ({
  icon: Icon,
  label,
  numberOfItems,
  variant,
}: InfoCardProps) => {
  return (
    <div className="flex items-center gap-x-2 rounded-md border p-3">
      <IconBadge icon={Icon} variant={variant ?? "default"} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-gray-500">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
